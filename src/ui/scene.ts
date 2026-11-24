// The drawing: the Sun, the planets, the Moon, Saturn's rings, the lines of the orbits and the starry
// background, with three.js. It knows nothing of time or of flights: every frame it is told where the bodies
// are (scene units), how they are turned, where the camera stands and what it looks at. Everything is drawn
// relative to the point looked at — so the body in front of the camera is drawn exactly even when it is
// billions of kilometres from the Sun.
import * as THREE from 'three';
import { SKY } from '../config.ts';
import { BODY_IDS, type BodyId } from '../core/bodies.ts';
import type { Attitude } from '../core/ephemeris.ts';
import type { Shade } from '../core/shadow.ts';
import { cross, sub, type Vec3 } from '../core/vec.ts';
import { shadeMaterial, type ShadeMaterial } from './shade-material.ts';
import { BODY_TEXTURES, RING_TEXTURE, STARS_TEXTURE } from './textures.ts';

export interface Frame {
  where: Record<BodyId, Vec3>;
  radius: Record<BodyId, number>;
  turned: Record<BodyId, Attitude>;
  ring: { inner: number; outer: number };
  /** Bodies another body may hide the Sun from: the shadow on each; null — none now. */
  shade: Partial<Record<BodyId, Shade | null>>;
  /** The point looked at and the place of the camera, scene units. */
  target: Vec3;
  eye: Vec3;
}

export interface Orbit {
  /** The body the line goes around: its place is the line's origin. */
  around: BodyId;
  points: Vec3[];
}

export interface SceneView {
  /** Draws a frame. */
  draw(frame: Frame): void;
  /** New lines of the orbits (after the scale or the day has changed). */
  setOrbits(orbits: Partial<Record<BodyId, Orbit>>): void;
  /** The place of a body on the screen, CSS pixels from the canvas corner; null — behind the camera. */
  onScreen(id: BodyId): { x: number; y: number } | null;
  /**
   * A place on a body's surface, given as a unit vector from the body's centre: where it is on the screen and
   * how squarely it faces the camera (1 — straight at it, 0 — on the edge of the disc, below 0 — on the far side).
   */
  surfaceOnScreen(id: BodyId, direction: Vec3): { x: number; y: number; facing: number } | null;
  resize(): void;
  /** How much of the picture the bars cover at the top and at the bottom, CSS px: the view centres between them. */
  setCovered(top: number, bottom: number): void;
  /** Called when a picture has arrived: the frame should be drawn again. */
  onLoad: () => void;
  destroy(): void;
}

/** A flat ring whose picture runs from the inner edge (left of the texture) to the outer (right). */
function ringGeometry(segments: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(a), 0, Math.sin(a), Math.cos(a), 0, Math.sin(a));
    uvs.push(0, 0.5, 1, 0.5);
    if (i < segments) index.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  return geometry;
}

/** A soft glow around the Sun, painted once in the colour given, fading outwards. */
function glowTexture(colour: string): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d') as CanvasRenderingContext2D;
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, colour);
  gradient.addColorStop(1, colour);
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  // The same colour all over; how strong it is falls from the middle to nothing at the edge.
  const pixels = g.getImageData(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const far = Math.min(1, Math.hypot(x - size / 2, y - size / 2) / (size / 2));
      pixels.data[(y * size + x) * 4 + 3] = Math.round(255 * 0.9 * (1 - far) ** 2.4);
    }
  }
  g.putImageData(pixels, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

export function createSceneView(canvas: HTMLCanvasElement): SceneView {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(SKY.fovDeg, 1, 1e-6, 1e7);
  const loader = new THREE.TextureLoader();
  // The colours of the picture come from the tokens, like every colour of the screen.
  const css = getComputedStyle(canvas);
  const tint = (name: string): string => css.getPropertyValue(name).trim();
  // A phone may take the graphics away while the app is in the background and give them back later: the
  // picture is drawn only when something has changed, so its return must count as a change.
  canvas.addEventListener('webglcontextlost', (event) => event.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => view.onLoad());
  const view: SceneView = { draw, setOrbits, onScreen, surfaceOnScreen, resize, setCovered, onLoad: () => undefined, destroy };
  let covered = { top: 0, bottom: 0 };

  const picture = (url: string): THREE.Texture => {
    const texture = loader.load(url, () => view.onLoad());
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
  };

  // ---------- light: the Sun shines the same on Mercury and on Neptune, or the far planets would be black ----------
  const sunlight = new THREE.PointLight(0xffffff, 3.2, 0, 0);
  scene.add(sunlight, new THREE.AmbientLight(0xffffff, 0.05));

  // ---------- bodies ----------
  const ball = new THREE.SphereGeometry(1, 96, 48);
  const meshes = {} as Record<BodyId, THREE.Mesh>;
  const shaded: Partial<Record<BodyId, ShadeMaterial>> = {};
  for (const id of BODY_IDS) {
    const map = picture(BODY_TEXTURES[id]);
    const tint = id === 'moon' ? SKY.shade.moon : id === 'earth' ? SKY.shade.earth : null;
    if (tint) shaded[id] = shadeMaterial(map, tint);
    const material = id === 'sun' ? new THREE.MeshBasicMaterial({ map }) : (shaded[id]?.material ?? new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 }));
    meshes[id] = new THREE.Mesh(ball, material);
    scene.add(meshes[id]);
  }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(tint('--glow')), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  scene.add(glow);

  // Saturn's rings lie in its equator: a child of the planet, which is turned as a whole.
  const ringMap = picture(RING_TEXTURE);
  const ring = new THREE.Mesh(ringGeometry(128), new THREE.MeshBasicMaterial({ map: ringMap, transparent: true, side: THREE.DoubleSide, depthWrite: false, color: new THREE.Color(tint('--ring-tint')) }));
  const ringShape = ring.geometry.getAttribute('position') as THREE.BufferAttribute;
  scene.add(ring);

  // ---------- the starry background: a decoration that stays around the camera ----------
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 24),
    new THREE.MeshBasicMaterial({ map: picture(STARS_TEXTURE), side: THREE.BackSide, depthWrite: false, depthTest: false, color: new THREE.Color(tint('--backdrop-dim')) }),
  );
  sky.renderOrder = -1;
  sky.frustumCulled = false;
  scene.add(sky);

  // ---------- the lines of the orbits ----------
  const lines = new Map<BodyId, { line: THREE.LineLoop; around: BodyId }>();
  const lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(tint('--orbit')), transparent: true, opacity: 0.45, depthWrite: false });

  function setOrbits(orbits: Partial<Record<BodyId, Orbit>>): void {
    for (const { line } of lines.values()) {
      scene.remove(line);
      line.geometry.dispose();
    }
    lines.clear();
    for (const [id, orbit] of Object.entries(orbits) as [BodyId, Orbit][]) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(orbit.points.flat(), 3));
      const line = new THREE.LineLoop(geometry, lineMaterial);
      line.frustumCulled = false;
      scene.add(line);
      lines.set(id, { line, around: orbit.around });
    }
  }

  const basis = new THREE.Matrix4();
  let last: Frame | null = null;
  let ringSpan = { inner: 0, outer: 0 };

  function draw(frame: Frame): void {
    last = frame;
    const rel = (p: Vec3): Vec3 => sub(p, frame.target);
    for (const id of BODY_IDS) {
      const mesh = meshes[id];
      mesh.position.set(...rel(frame.where[id]));
      mesh.scale.setScalar(frame.radius[id]);
      // The picture's middle (longitude 0) looks along +X of the ball, its north along +Y.
      const { north, meridian } = frame.turned[id];
      const z = cross(meridian, north);
      basis.makeBasis(new THREE.Vector3(...meridian), new THREE.Vector3(...north), new THREE.Vector3(...z));
      mesh.quaternion.setFromRotationMatrix(basis);
    }
    for (const [id, material] of Object.entries(shaded) as [BodyId, ShadeMaterial][]) material.set(frame.shade[id] ?? null);
    sunlight.position.copy(meshes.sun.position);
    glow.position.copy(meshes.sun.position);
    glow.scale.setScalar(frame.radius.sun * 7);

    if (ringSpan.inner !== frame.ring.inner || ringSpan.outer !== frame.ring.outer) {
      ringSpan = { ...frame.ring };
      for (let i = 0; i < ringShape.count; i += 2) {
        const a = (i / 2 / ((ringShape.count - 2) / 2)) * Math.PI * 2;
        ringShape.setXYZ(i, Math.cos(a) * ringSpan.inner, 0, Math.sin(a) * ringSpan.inner);
        ringShape.setXYZ(i + 1, Math.cos(a) * ringSpan.outer, 0, Math.sin(a) * ringSpan.outer);
      }
      ringShape.needsUpdate = true;
    }
    ring.position.copy(meshes.saturn.position);
    ring.quaternion.copy(meshes.saturn.quaternion);

    for (const { line, around } of lines.values()) line.position.set(...rel(frame.where[around]));

    const eye = rel(frame.eye);
    const distance = Math.hypot(...eye);
    camera.position.set(...eye);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(1e-7, distance * 0.001);
    camera.far = Math.max(1e4, distance * 1e4);
    camera.updateProjectionMatrix();
    sky.position.copy(camera.position);
    sky.scale.setScalar(camera.far * 0.5);
    renderer.render(scene, camera);
  }

  const projected = new THREE.Vector3();
  function onScreen(id: BodyId): { x: number; y: number } | null {
    if (!last) return null;
    projected.copy(meshes[id].position).project(camera);
    if (projected.z > 1 || projected.z < -1) return null;
    return { x: ((projected.x + 1) / 2) * canvas.clientWidth, y: ((1 - projected.y) / 2) * canvas.clientHeight };
  }

  const toCamera = new THREE.Vector3();
  function surfaceOnScreen(id: BodyId, direction: Vec3): { x: number; y: number; facing: number } | null {
    if (!last) return null;
    const mesh = meshes[id];
    projected.set(...direction).multiplyScalar(mesh.scale.x).add(mesh.position);
    toCamera.copy(camera.position).sub(projected).normalize();
    const facing = toCamera.x * direction[0] + toCamera.y * direction[1] + toCamera.z * direction[2];
    projected.project(camera);
    if (projected.z > 1 || projected.z < -1) return null;
    return { x: ((projected.x + 1) / 2) * canvas.clientWidth, y: ((1 - projected.y) / 2) * canvas.clientHeight, facing };
  }

  function resize(): void {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // The field of view is measured across the shorter side: a phone held upright sees as much as a wide screen.
    const half = Math.tan((SKY.fovDeg * Math.PI) / 360);
    camera.fov = camera.aspect >= 1 ? SKY.fovDeg : (Math.atan(half / camera.aspect) * 360) / Math.PI;
    // The point looked at stands in the middle of what the bars leave free, not of the whole screen.
    camera.setViewOffset(width, height, 0, (covered.bottom - covered.top) / 2, width, height);
    camera.updateProjectionMatrix();
  }

  function setCovered(top: number, bottom: number): void {
    if (covered.top === top && covered.bottom === bottom) return;
    covered = { top, bottom };
    resize();
  }

  function destroy(): void {
    renderer.dispose();
  }

  resize();
  return view;
}
