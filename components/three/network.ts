// Geometry and shaders for the neural core (spec 3.3.1). All per-frame motion
// happens in the vertex shader; JavaScript only updates a handful of uniforms.

/** Deterministic random numbers, so the network looks the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RADIUS = 1.7;
const LINK_DISTANCE = 0.27;
const MAX_LINKS_PER_POINT = 2;

export type Network = {
  positions: Float32Array;
  seeds: Float32Array;
  tints: Float32Array;
  linePositions: Float32Array;
  lineSeeds: Float32Array;
  lineTints: Float32Array;
};

/** Points on an irregular sphere, plus line segments between points that sit close together. */
export function buildNetwork(count: number): Network {
  const random = mulberry32(7);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const tints = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Uniform direction on the sphere.
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const x = s * Math.cos(theta);
    const y = u;
    const z = s * Math.sin(theta);

    // Irregular surface: a few low-frequency bumps, and some points inside the shell.
    const bumps =
      0.82 + 0.1 * Math.sin(3 * x + 1.3) * Math.cos(2 * y) + 0.08 * Math.sin(4 * z + 2 * x);
    const depth = random() < 0.3 ? Math.cbrt(random()) : 1;
    const r = RADIUS * bumps * depth;

    positions.set([x * r, y * r, z * r], i * 3);
    seeds[i] = random();
    // Mostly the main accent, with a few points in the agent's violet.
    tints[i] = random() < 0.12 ? 1 : 0;
  }

  // Neighbours through a spatial hash, so linking stays linear in the point count.
  const cell = (v: number) => Math.floor(v / LINK_DISTANCE);
  const grid = new Map<string, number[]>();
  for (let i = 0; i < count; i++) {
    const key = `${cell(positions[i * 3])},${cell(positions[i * 3 + 1])},${cell(positions[i * 3 + 2])}`;
    const bucket = grid.get(key);
    if (bucket) bucket.push(i);
    else grid.set(key, [i]);
  }

  const segments: number[] = [];
  const links = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    const [px, py, pz] = [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
    const [cx, cy, cz] = [cell(px), cell(py), cell(pz)];

    for (let dx = -1; dx <= 1 && links[i] < MAX_LINKS_PER_POINT; dx++) {
      for (let dy = -1; dy <= 1 && links[i] < MAX_LINKS_PER_POINT; dy++) {
        for (let dz = -1; dz <= 1 && links[i] < MAX_LINKS_PER_POINT; dz++) {
          for (const j of grid.get(`${cx + dx},${cy + dy},${cz + dz}`) ?? []) {
            if (j <= i || links[i] >= MAX_LINKS_PER_POINT || links[j] >= MAX_LINKS_PER_POINT) {
              continue;
            }
            const distance = Math.hypot(
              positions[j * 3] - px,
              positions[j * 3 + 1] - py,
              positions[j * 3 + 2] - pz,
            );
            if (distance > LINK_DISTANCE) continue;
            segments.push(i, j);
            links[i]++;
            links[j]++;
          }
        }
      }
    }
  }

  // Each line vertex copies its point's attributes, so lines follow the points exactly.
  const linePositions = new Float32Array(segments.length * 3);
  const lineSeeds = new Float32Array(segments.length);
  const lineTints = new Float32Array(segments.length);
  segments.forEach((point, vertex) => {
    linePositions.set(positions.subarray(point * 3, point * 3 + 3), vertex * 3);
    lineSeeds[vertex] = seeds[point];
    lineTints[vertex] = tints[point];
  });

  return { positions, seeds, tints, linePositions, lineSeeds, lineTints };
}

// Shared by points and lines: drift, condensing into the core, repulsion from
// the pointer (in screen pixels) and the slide towards the agent icon.
const displace = /* glsl */ `
  uniform float uTime;
  uniform float uCondense;
  uniform float uScale;
  uniform float uCoreTint;
  uniform float uRepel;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec2 uShift;
  attribute float aSeed;
  attribute float aTint;
  varying float vTint;

  vec4 project(vec3 base, out float depth) {
    float t = uTime * 0.35 + aSeed * 6.2831;
    vec3 p = base + 0.07 * vec3(
      sin(t + base.y * 2.0),
      cos(t * 1.1 + base.z * 2.0),
      sin(t * 0.9 + base.x * 2.0)
    );
    p *= mix(1.0, 0.045 + 0.03 * aSeed, uCondense) * uScale;

    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * view;
    depth = -view.z;

    vec2 fromPointer = (clip.xy / clip.w - uPointer) * uResolution * 0.5;
    float distancePx = length(fromPointer);
    float push = uRepel * smoothstep(80.0, 0.0, distancePx) * 36.0;
    clip.xy += normalize(fromPointer + 0.0001) * push / (uResolution * 0.5) * clip.w;

    clip.xy += uShift * clip.w;
    // The hero core turns violet (the agent's colour); the contact one keeps the accent.
    vTint = max(aTint, uCondense * uCoreTint);
    return clip;
  }
`;

const tint = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uCondense;
  uniform float uCoreAlpha;
  varying float vTint;
`;

export const pointsVertex = /* glsl */ `
  ${displace}
  uniform float uSize;
  void main() {
    float depth;
    gl_Position = project(position, depth);
    gl_PointSize = uSize * (1.0 + 2.2 * uCondense) * (6.0 / depth);
  }
`;

export const pointsFragment = /* glsl */ `
  ${tint}
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // Thousands of points pile up in the core, so each one dims as they condense.
    float alpha = smoothstep(0.5, 0.05, d) * uOpacity * mix(1.0, uCoreAlpha, uCondense);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vTint), alpha);
  }
`;

export const linesVertex = /* glsl */ `
  ${displace}
  void main() {
    float depth;
    gl_Position = project(position, depth);
  }
`;

export const linesFragment = /* glsl */ `
  ${tint}
  uniform float uLineOpacity;
  void main() {
    gl_FragColor = vec4(mix(uColorA, uColorB, vTint), uLineOpacity * uOpacity * (1.0 - uCondense));
  }
`;
