"use client";

// Shader uniforms are mutated every frame by design: that is how a WebGL scene
// animates without re-rendering React. The immutability rule does not apply to them.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FLIGHT_MS, getFlight, onFlightStart, setSceneReady } from "./flight";
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
      uScale: { value: 1 },
      uCoreTint: { value: 1 },
      uCoreAlpha: { value: 0.025 },
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

    const viewportHeight = window.innerHeight;
    const hero = document.querySelector("[data-hero]")?.getBoundingClientRect();
    const icon = document.querySelector<HTMLElement>("[data-agent-core]");
    const layer = state.gl.domElement.closest<HTMLElement>("[data-neural-canvas]");

    // Hero: 0 at the top of the page, 1 when the hero has scrolled away.
    const progress = hero ? clamp01(-hero.top / hero.height) : 1;
    const inHero = Boolean(hero && hero.bottom > 0);
    const narrow = size.width < 768;
    const flight = inHero ? null : getFlight();

    // Screen position (in clip space) of the centre of the network when nothing moves it.
    const wide = viewport.aspect > 1.1;
    root.position.set(wide ? viewport.width * 0.25 : 0, wide ? 0 : viewport.height * 0.12, 0);
    center.current.copy(root.position).project(camera);
    const towards = (x: number, y: number, amount: number) =>
      u.uShift.value.set(
        ((x / window.innerWidth) * 2 - 1 - center.current.x) * amount,
        (-(y / viewportHeight) * 2 + 1 - center.current.y) * amount,
      );

    let condense = 0;
    let coreTint = 1;
    let opacity = 0;
    let follow = false;

    if (inHero) {
      // 0-60%: the network condenses into the core. 60-100%: the core flies to the
      // agent icon, shrinking to its size, and the two cross-fade as it lands.
      condense = smoothstep(0, 0.6, progress);
      const travel = smoothstep(0.55, 0.97, progress);
      const landing = smoothstep(0.8, 0.97, progress);
      opacity = 1 - smoothstep(0.9, 1, progress);
      follow = interactive;
      u.uScale.value = 1 - 0.55 * landing;

      if (icon) {
        const rect = icon.getBoundingClientRect();
        towards(rect.left + rect.width / 2, rect.top + rect.height / 2, travel);
        // Hidden for the whole flight, so it only ever appears where the core lands.
        icon.style.opacity = String(landing);
      } else {
        u.uShift.value.set(0, 0);
      }
      // The agent card is opaque, so the core has to fly in front of the page to reach it.
      if (travel > 0) layer?.style.setProperty("z-index", "30");
      else layer?.style.removeProperty("z-index");
    } else if (flight) {
      // The core comes down from the inline chat and settles in the corner,
      // where the floating button fades in as it arrives.
      const t = clamp01((performance.now() - flight.start) / FLIGHT_MS);
      const eased = smoothstep(0, 1, t);
      condense = 1;
      opacity = smoothstep(0, 0.15, t) * (1 - smoothstep(0.8, 1, t));
      u.uScale.value = 0.5;
      towards(
        flight.from.x + (flight.to.x - flight.from.x) * eased,
        // A slight arc, so it reads as a flight rather than a slide.
        flight.from.y + (flight.to.y - flight.from.y) * eased - Math.sin(Math.PI * eased) * 48,
        1,
      );
      icon?.style.removeProperty("opacity");
      layer?.style.setProperty("z-index", "30");
    } else {
      // Contact: the reverse of the hero. Once the "work with me" line has filled,
      // a small core leaves its end and opens up into the calm network.
      const track = document.querySelector("[data-work-with-me]");
      const fill = track?.querySelector("[data-line-fill]")?.getBoundingClientRect();
      const trackBottom = track?.getBoundingClientRect().bottom ?? viewportHeight;
      // The line is full when the list's bottom reaches 55% of the viewport (lib/motion).
      const opening = smoothstep(
        0,
        1,
        (viewportHeight * 0.55 - trackBottom) / (viewportHeight * 0.7),
      );

      condense = 1 - opening;
      coreTint = 0;
      // Bright while it is a small core, settling to the calm level as it opens.
      opacity = (1 - 0.4 * opening) * smoothstep(0, 0.06, opening);
      u.uScale.value = 1;
      if (fill) towards(fill.right, fill.bottom, 1 - smoothstep(0, 0.85, opening));
      else u.uShift.value.set(0, 0);

      icon?.style.removeProperty("opacity");
      layer?.style.removeProperty("z-index");
    }

    u.uTime.value += delta;
    u.uCondense.value = condense;
    u.uCoreTint.value = coreTint;
    // All the points of the hero pile up in its core; the contact core has a third of them.
    u.uCoreAlpha.value = inHero ? 0.025 : flight ? 0.07 : 0.2;
    u.uResolution.value.set(size.width, size.height);
    u.uSize.value = (narrow ? 2.2 : 2.6) * state.gl.getPixelRatio();
    // On narrow screens the network sits behind the text, so it is dimmed to keep it readable.
    u.uOpacity.value = opacity * (narrow ? 0.45 : 1);

    // The contact version is calmer: a third of the points, no lines, no pointer play.
    pointsGeometry.current?.setDrawRange(0, inHero ? count : Math.floor(count / 3));
    linesGeometry.current?.setDrawRange(0, inHero ? Infinity : 0);
    u.uRepel.value = follow ? 1 - condense : 0;
    u.uPointer.value.copy(pointer.current);

    // Leans up to 8 degrees towards the pointer, on top of a slow spin of its own.
    const ease = 1 - Math.exp(-delta * 3);
    const leanX = follow ? -THREE.MathUtils.clamp(pointer.current.y, -1, 1) * MAX_TILT : 0;
    const leanY = follow ? THREE.MathUtils.clamp(pointer.current.x, -1, 1) * MAX_TILT : 0;
    tilt.current.x += (leanX - tilt.current.x) * ease;
    tilt.current.y += (leanY - tilt.current.y) * ease;
    spin.current += delta * 0.06;
    root.rotation.set(tilt.current.x, spin.current + tilt.current.y, 0);
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
  const [flying, setFlying] = useState(false);

  // Flights happen mid-page, where the scene is otherwise paused.
  useEffect(() => {
    if (!ready) return;
    setSceneReady(true);
    let timer = 0;
    const stop = onFlightStart(() => {
      setFlying(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFlying(false), FLIGHT_MS + 80);
    });
    return () => {
      setSceneReady(false);
      window.clearTimeout(timer);
      stop();
    };
  }, [ready]);

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
    // The contact network starts opening while "work with me" is still on screen.
    document
      .querySelectorAll("[data-hero], [data-work-with-me], #contact")
      .forEach((el) => observer.observe(el));
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
        frameloop={active || flying ? "always" : "never"}
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
