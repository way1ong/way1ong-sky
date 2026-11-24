// A body's surface that can lie in another body's shadow: the usual lit material of three.js with one more
// step — the light of every point of the picture is cut by the part of the Sun hidden from it. The sums are
// those of core/shadow.ts (lightAt), written for the graphics card; the numbers come from there (shadeOf).
import * as THREE from 'three';
import type { Shade } from '../core/shadow.ts';

export interface ShadeMaterial {
  material: THREE.MeshStandardMaterial;
  /** The shadow for this frame; null — nothing stands before the Sun. */
  set(shade: Shade | null): void;
}

const VERTEX_HEAD = /* glsl */ `
varying vec3 vBodyDir;
`;
// The direction of a point of the ball from its middle, in the scene's axes: the ball's own point, turned
// as the ball is turned (its size does not matter for a direction).
const VERTEX_BODY = /* glsl */ `
vBodyDir = normalize(mat3(modelMatrix) * position);
`;
const FRAGMENT_HEAD = /* glsl */ `
varying vec3 vBodyDir;
uniform float uShadeOn;
uniform vec3 uSunDir;
uniform vec3 uOccDir;
uniform vec3 uCross0;
uniform float uSunAngle;
uniform float uOccRel;
uniform float uBodyRel;
uniform vec3 uShadeTint;

float discOverlap(float a, float b, float d) {
  if (d >= a + b) return 0.0;
  if (d <= abs(a - b)) { float m = min(a, b); return 3.141592653589793 * m * m; }
  float x = acos(clamp((d * d + a * a - b * b) / (2.0 * d * a), -1.0, 1.0));
  float y = acos(clamp((d * d + b * b - a * a) / (2.0 * d * b), -1.0, 1.0));
  return a * a * (x - sin(2.0 * x) / 2.0) + b * b * (y - sin(2.0 * y) / 2.0);
}

float sunLeft() {
  if (uShadeOn < 0.5) return 1.0;
  vec3 p = uBodyRel * normalize(vBodyDir);
  vec3 e = uOccDir - p;
  float le = length(e);
  if (dot(uSunDir, e) <= 0.0) return 1.0;
  float occAngle = uOccRel / le;
  float apart = length((uCross0 - cross(uSunDir, p)) / le);
  float covered = discOverlap(1.0, occAngle / uSunAngle, apart / uSunAngle) / 3.141592653589793;
  return 1.0 - min(1.0, covered);
}
`;
const FRAGMENT_BODY = /* glsl */ `
outgoingLight *= mix(uShadeTint, vec3(1.0), sunLeft());
`;

export function shadeMaterial(map: THREE.Texture, tint: readonly [number, number, number]): ShadeMaterial {
  const uniforms = {
    uShadeOn: { value: 0 },
    uSunDir: { value: new THREE.Vector3(1, 0, 0) },
    uOccDir: { value: new THREE.Vector3(1, 0, 0) },
    uCross0: { value: new THREE.Vector3() },
    uSunAngle: { value: 1 },
    uOccRel: { value: 0 },
    uBodyRel: { value: 0 },
    uShadeTint: { value: new THREE.Vector3(...tint) },
  };
  const material = new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${VERTEX_HEAD}`).replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERTEX_BODY}`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${FRAGMENT_HEAD}`).replace('#include <opaque_fragment>', `${FRAGMENT_BODY}\n#include <opaque_fragment>`);
  };
  return {
    material,
    set(shade) {
      uniforms.uShadeOn.value = shade ? 1 : 0;
      if (!shade) return;
      uniforms.uSunDir.value.set(...shade.sunDir);
      uniforms.uOccDir.value.set(...shade.occDir);
      uniforms.uCross0.value.set(...shade.cross0);
      uniforms.uSunAngle.value = shade.sunAngle;
      uniforms.uOccRel.value = shade.occRel;
      uniforms.uBodyRel.value = shade.bodyRel;
    },
  };
}
