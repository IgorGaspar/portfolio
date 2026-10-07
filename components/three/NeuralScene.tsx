"use client";

// Shader uniforms are mutated every frame by design: that is how a WebGL scene
// animates without re-rendering React. The immutability rule does not apply to them.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildNetwork, linesFragment, linesVertex, pointsFragment, pointsVertex } from "./network";

const MAX_TILT = THREE.MathUtils.degToRad(8);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const cssColor = (name: string) =>
  new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());

type NetworkProps = { count: number; interactive: boolean };

function Network({ count, interactive }: NetworkProps) {
  const group = useRef<THREE.Group>(null);
  const pointsGeometry = useRef<THREE.BufferGeometry>(null);
  const linesGeometry = useRef<THREE.BufferGeometry>(null);
  // Starts far off-screen so nothing is pushed away before the pointer moves.
  const pointer = useRef(new THREE.Vector2(10, 10));
  const tilt = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const { size, viewport, camera } = useThree();

  const network = useMemo(() => buildNetwork(count), [count]);

  // Points and lines are two materials reading one uniform object, so a single
  // write per frame moves both. (Passing uniforms as a JSX prop would copy them.)
  const { uniforms: u, materials } = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uCondense: { value: 0 },
      uRepel: { value: 0 },
      uPointer: { value: new THREE.Vector2(10, 10) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uShift: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uOpacity: { value: 0 },
      uSize: { value: 1 },
      uLineOpacity: { value: 0.22 },
    };
    const shared = { uniforms, transparent: true, depthWrite: false };
    return {
      uniforms,
      materials: {
        points: new THREE.ShaderMaterial({
          ...shared,
          vertexShader: pointsVertex,
          fragmentShader: pointsFragment,
        }),
        lines: new THREE.ShaderMaterial({
          ...shared,
          vertexShader: linesVertex,
          fragmentShader: linesFragment,
        }),
      },
    };
  }, []);

  useEffect(
    () => () => {
      materials.points.dispose();
      materials.lines.dispose();
    },
    [materials],
  );

  // Colours come from the design tokens and follow the light/dark theme.
  useEffect(() => {
    const apply = () => {
      u.uColorA.value.copy(cssColor("--accent"));
      u.uColorB.value.copy(cssColor("--accent-2"));
      const light = document.documentElement.dataset.theme === "light";
      // Additive light only reads on a dark background.
      for (const material of [materials.points, materials.lines]) {
        material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        material.needsUpdate = true;
      }
      u.uLineOpacity.value = light ? 0.26 : 0.22;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [u, materials]);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (event: PointerEvent) =>
      pointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  // The agent icon fades in as the core arrives; it must never stay half-faded.
  useEffect(
    () => () => {
      document.querySelector<HTMLElement>("[data-agent-core]")?.style.removeProperty("opacity");
    },
    [],
  );

  const center = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const root = group.current;
    if (!root) return;

    const hero = document.querySelector("[data-hero]")?.getBoundingClientRect();
    const contact = document.getElementById("contact")?.getBoundingClientRect();
    const icon = document.querySelector<HTMLElement>("[data-agent-core]");

    // Hero: 0 at the top of the page, 1 when the hero has scrolled away.
    const progress = hero ? clamp01(-hero.top / hero.height) : 1;
    const inHero = Boolean(hero && hero.bottom > 0);
    // Contact: how far the section has come into view.
    const contactView = contact
      ? clamp01((window.innerHeight - contact.top) / window.innerHeight)
      : 0;

    // 0-60%: condense into the core. 60-100%: the core travels to the agent icon.
    const condense = inHero ? smoothstep(0, 0.6, progress) : 0;
    const travel = inHero ? smoothstep(0.6, 1, progress) : 0;
    const arrive = inHero ? smoothstep(0.85, 1, progress) : 0;

    u.uTime.value += delta;
    u.uCondense.value = condense;
    u.uResolution.value.set(size.width, size.height);
    u.uSize.value = (size.width < 768 ? 2.2 : 2.6) * state.gl.getPixelRatio();
    // On narrow screens the network sits behind the text, so it is dimmed to keep it readable.
    const strength = size.width < 768 ? 0.45 : 1;
    u.uOpacity.value = strength * (inHero ? 1 - arrive : 0.55 * smoothstep(0.1, 0.7, contactView));

    // The contact version is calmer: a third of the points and no pointer play.
    const calm = !inHero;
    const visible = calm ? Math.floor(count / 3) : count;
    pointsGeometry.current?.setDrawRange(0, visible);
    linesGeometry.current?.setDrawRange(0, calm ? 0 : Infinity);

    const active = interactive && !calm ? 1 - condense : 0;
    u.uRepel.value = active;
    u.uPointer.value.copy(pointer.current);

    // Sits to the right of the text on wide screens, behind it on narrow ones.
    const wide = viewport.aspect > 1.1;
    root.position.set(wide ? viewport.width * 0.25 : 0, wide ? 0 : viewport.height * 0.12, 0);

    // Leans up to 8 degrees towards the pointer, on top of a slow spin of its own.
    const follow = interactive && !calm;
    const ease = 1 - Math.exp(-delta * 3);
    const leanX = follow ? -THREE.MathUtils.clamp(pointer.current.y, -1, 1) * MAX_TILT : 0;
    const leanY = follow ? THREE.MathUtils.clamp(pointer.current.x, -1, 1) * MAX_TILT : 0;
    tilt.current.x += (leanX - tilt.current.x) * ease;
    tilt.current.y += (leanY - tilt.current.y) * ease;
    spin.current += delta * 0.06;
    root.rotation.set(tilt.current.x, spin.current + tilt.current.y, 0);

    // Slide the whole core to where the agent icon is on screen.
    if (icon && travel > 0) {
      const rect = icon.getBoundingClientRect();
      center.current.copy(root.position).project(camera);
      const targetX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const targetY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      u.uShift.value.set(
        (targetX - center.current.x) * travel,
        (targetY - center.current.y) * travel,
      );
      icon.style.opacity = String(arrive);
      // The agent card is opaque, so the core has to fly in front of the page to reach it.
      state.gl.domElement
        .closest<HTMLElement>("[data-neural-canvas]")
        ?.style.setProperty("z-index", "30");
    } else {
      u.uShift.value.set(0, 0);
      icon?.style.removeProperty("opacity");
      state.gl.domElement
        .closest<HTMLElement>("[data-neural-canvas]")
        ?.style.removeProperty("z-index");
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false} material={materials.points}>
        <bufferGeometry ref={pointsGeometry}>
          <bufferAttribute attach="attributes-position" args={[network.positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[network.seeds, 1]} />
          <bufferAttribute attach="attributes-aTint" args={[network.tints, 1]} />
        </bufferGeometry>
      </points>
      <lineSegments frustumCulled={false} material={materials.lines}>
        <bufferGeometry ref={linesGeometry}>
          <bufferAttribute attach="attributes-position" args={[network.linePositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[network.lineSeeds, 1]} />
          <bufferAttribute attach="attributes-aTint" args={[network.lineTints, 1]} />
        </bufferGeometry>
      </lineSegments>
    </group>
  );
}

type Props = { count: number; interactive: boolean; onFailure: () => void };

/**
 * One fixed, full-screen canvas behind the page. It shows the neural core in
 * the hero and its calm version in the contact section, and stops rendering
 * whenever neither is on screen or the tab is hidden.
 */
export default function NeuralScene({ count, interactive, onFailure }: Props) {
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScreen = new Set<Element>();
    const update = () => setActive(onScreen.size > 0 && !document.hidden);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      update();
    });
    document.querySelectorAll("[data-hero], #contact").forEach((el) => observer.observe(el));
    document.addEventListener("visibilitychange", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // When rendering stops, the agent icon must not be left half-faded.
  useEffect(() => {
    if (!active) {
      document.querySelector<HTMLElement>("[data-agent-core]")?.style.removeProperty("opacity");
    }
  }, [active]);

  return (
    <div
      aria-hidden="true"
      data-neural-canvas
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-[800ms] ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          setReady(true);
          // A lost context falls back to the static image instead of a blank hero.
          gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true });
        }}
        fallback={null}
      >
        <Network count={count} interactive={interactive} />
      </Canvas>
    </div>
  );
}
