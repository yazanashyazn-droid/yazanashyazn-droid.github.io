// Interactive 3D viewer for the gallery: one stage, several GLB models. Each can sweep into an
// X-ray view of its real mesh lines. three.js only downloads when this gallery opens, and each
// model only downloads when its tab is chosen.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

const CORAL = 0xf96450;
const PETROL = 0x3e9aaf;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const nextTask = () => new Promise<void>((r) => setTimeout(r));

/* Mesh lines without the diagonals of flat quads, so it reads like the mesh in Blender. */
function buildLines(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const index = geo.getIndex();
  const faces = index ? index.count / 3 : pos.count / 3;
  const at = (i: number) => (index ? index.getX(i) : i);

  // Exported vertices are split along seams: weld by position so edges match up.
  // The tolerance follows the part's size, because some parts are modelled very small.
  geo.computeBoundingBox();
  const extent = geo.boundingBox!.getSize(new THREE.Vector3());
  const q = 1e5 / Math.max(extent.x, extent.y, extent.z, 1e-6);
  const weld = new Map<string, number>();
  const ids = new Int32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const key = `${Math.round(pos.getX(i) * q)},${Math.round(pos.getY(i) * q)},${Math.round(pos.getZ(i) * q)}`;
    let id = weld.get(key);
    if (id === undefined) {
      id = weld.size;
      weld.set(key, id);
    }
    ids[i] = id;
  }
  const big = weld.size;

  const normals = new Float32Array(faces * 3);
  const longest = new Float64Array(faces);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const edges = new Map<number, { i: number; j: number; f1: number; f2: number }>();

  for (let f = 0; f < faces; f++) {
    const v = [at(f * 3), at(f * 3 + 1), at(f * 3 + 2)];
    a.fromBufferAttribute(pos, v[0]);
    b.fromBufferAttribute(pos, v[1]);
    c.fromBufferAttribute(pos, v[2]);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    longest[f] = Math.max(ab.lengthSq(), ac.lengthSq(), b.distanceToSquared(c));
    ab.cross(ac).normalize();
    normals[f * 3] = ab.x;
    normals[f * 3 + 1] = ab.y;
    normals[f * 3 + 2] = ab.z;
    for (let e = 0; e < 3; e++) {
      const i = v[e];
      const j = v[(e + 1) % 3];
      const lo = Math.min(ids[i], ids[j]);
      const hi = Math.max(ids[i], ids[j]);
      if (lo === hi) continue;
      const key = lo * big + hi;
      const known = edges.get(key);
      if (known) known.f2 = f;
      else edges.set(key, { i, j, f1: f, f2: -1 });
    }
  }

  const out: number[] = [];
  edges.forEach(({ i, j, f1, f2 }) => {
    if (f2 >= 0) {
      const dot = normals[f1 * 3] * normals[f2 * 3] + normals[f1 * 3 + 1] * normals[f2 * 3 + 1] + normals[f1 * 3 + 2] * normals[f2 * 3 + 2];
      const len = (pos.getX(i) - pos.getX(j)) ** 2 + (pos.getY(i) - pos.getY(j)) ** 2 + (pos.getZ(i) - pos.getZ(j)) ** 2;
      // A diagonal is the longest edge of both of its triangles, on a nearly flat surface
      if (dot > 0.985 && len >= longest[f1] * 0.999 && len >= longest[f2] * 0.999) return;
    }
    out.push(pos.getX(i), pos.getY(i), pos.getZ(i), pos.getX(j), pos.getY(j), pos.getZ(j));
  });
  const lines = new THREE.BufferGeometry();
  lines.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  return lines;
}

interface Variant {
  name: string;
  swatch: string;
  colors: Record<string, [number, number, number]>;
  hue?: number;
}

interface Part {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  delta: THREE.Vector3;
}

interface Entry {
  parts: Part[];
  /** Raises the model so exploded parts stay above the floor */
  lift: number;
  /** How far the camera backs away when fully exploded */
  dolly: number;
  materials: THREE.MeshPhysicalMaterial[];
  hue: { value: number };
  variants: Variant[];
  variant: number;
  group: THREE.Group;
  meshes: THREE.Mesh[];
  height: number;
  footprint: number;
  tris: number;
  overlays: Promise<void> | null;
}

export async function initModel(root: HTMLElement) {
  const holder = root.querySelector<HTMLElement>('[data-model-canvas]')!;
  const status = root.querySelector<HTMLElement>('[data-model-status]')!;
  const modes = root.querySelectorAll<HTMLButtonElement>('[data-model-mode]');
  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-model-tab]');
  const meshStat = root.querySelector<HTMLElement>('[data-model-tris]')!;
  const partStat = root.querySelector<HTMLElement>('[data-model-parts]')!;
  const swatches = root.querySelector<HTMLElement>('[data-model-swatches]')!;
  const explodeInput = root.querySelector<HTMLInputElement>('[data-model-explode]')!;
  const wrap = root.closest<HTMLElement>('[data-model-wrap]')!;
  const locale = document.documentElement.lang === 'ar' ? 'ar-SY' : 'en-US';

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    root.classList.add('is-failed');
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  holder.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false; // the wheel keeps scrolling the gallery
  controls.autoRotate = !reduced();
  controls.autoRotateSpeed = 1.1;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = Math.PI * 0.53;
  renderer.domElement.style.touchAction = 'pan-y'; // a vertical swipe still scrolls on phones
  renderer.domElement.addEventListener('pointerdown', () => (controls.autoRotate = false));

  const draco = new DRACOLoader();
  draco.setDecoderPath(root.dataset.draco!);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  /* Sweep planes: everything below the scan line is X-ray, everything above is solid */
  const solidClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
  const xrayClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
  const scan = { y: -1 };
  const applyScan = () => {
    solidClip.constant = -scan.y;
    xrayClip.constant = scan.y;
  };

  /* Glass-like shell that glows at grazing angles */
  const shell = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(PETROL) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    clipping: true,
    clippingPlanes: [xrayClip],
    vertexShader: `
      #include <clipping_planes_pars_vertex>
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
      }`,
    fragmentShader: `
      #include <clipping_planes_pars_fragment>
      uniform vec3 color;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        #include <clipping_planes_fragment>
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
        gl_FragColor = vec4(color * (rim * 0.3 + 0.006), 1.0);
      }`,
  });

  /* Soft contact shadow, drawn once on a canvas */
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(0,0,0,0.5)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.16)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(shadowCanvas),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  /* The scan line itself: a thin ring and a faint disc */
  const ringPts = new THREE.Path().absarc(0, 0, 1, 0, Math.PI * 2, false).getPoints(96);
  const scanRing = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(ringPts.map((p) => new THREE.Vector3(p.x, 0, p.y))),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }),
  );
  const scanDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1, 64),
    new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false }),
  );
  scanDisc.rotation.x = -Math.PI / 2;
  scene.add(scanRing, scanDisc);

  /* ---------- Loading ---------- */
  const cache = new Map<string, Promise<Entry | null>>();

  const load = (tab: HTMLButtonElement) => {
    const src = tab.dataset.src!;
    let job = cache.get(src);
    if (job) return job;
    job = new Promise<Entry | null>((resolve) => {
      loader.load(
        src,
        (gltf) => {
          const group = new THREE.Group();
          group.add(gltf.scene);
          // Same size on stage, standing on the floor, centred on the turntable
          const box = new THREE.Box3().setFromObject(gltf.scene, true);
          const size = box.getSize(new THREE.Vector3());
          const centre = box.getCenter(new THREE.Vector3());
          const scale = 1 / Math.max(size.x, size.y, size.z);
          gltf.scene.position.set(-centre.x, -box.min.y, -centre.z);
          group.scale.setScalar(scale);
          group.visible = false;
          scene.add(group);

          const meshes: THREE.Mesh[] = [];
          const materials: THREE.MeshPhysicalMaterial[] = [];
          const hue = { value: 0 };
          let tris = 0;
          gltf.scene.traverse((o) => {
            const mesh = o as THREE.Mesh;
            if (!mesh.isMesh) return;
            meshes.push(mesh);
            const idx = mesh.geometry.getIndex();
            tris += (idx ? idx.count : mesh.geometry.getAttribute('position').count) / 3;
            (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => {
              const mat = m as THREE.MeshPhysicalMaterial;
              // Real transmission needs an extra pass and turns black on a see-through canvas
              if (mat.transmission) {
                mat.transmission = 0;
                mat.transparent = true;
                mat.opacity = 0.28;
                mat.depthWrite = false;
              }
              mat.clippingPlanes = [solidClip];
              if (!materials.includes(mat)) materials.push(mat);
              // Label colourways: rotate the hue of the image, so black and white stay as they are
              if (mat.map) {
                mat.onBeforeCompile = (shader) => {
                  shader.uniforms.uHue = hue;
                  shader.fragmentShader = shader.fragmentShader
                    .replace(
                      '#include <common>',
                      `#include <common>
                      uniform float uHue;
                      vec3 hueRot(vec3 c, float a) {
                        const vec3 k = vec3(0.57735);
                        return c * cos(a) + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - cos(a));
                      }`,
                    )
                    .replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb = hueRot(diffuseColor.rgb, uHue);');
                };
              }
            });
          });

          /* Exploded view: where each part goes when fully apart */
          group.updateMatrixWorld(true);
          const middle = new THREE.Vector3(0, (size.y * scale) / 2, 0);
          const axisData = tab.dataset.axis?.split(',').map(Number);
          const centres = meshes.map((m) => new THREE.Box3().setFromObject(m, true).getCenter(new THREE.Vector3()));
          const worldDeltas = centres.map((c) => c.clone().sub(middle).multiply(new THREE.Vector3(1.3, 1.1, 1.3)));
          if (axisData) {
            // Layers along one axis, in the order they really sit
            const axis = new THREE.Vector3(...(axisData as [number, number, number])).normalize();
            const spread = Number(tab.dataset.spread) || 1;
            const order = centres.map((c, i) => ({ i, d: c.dot(axis) })).sort((x, y) => x.d - y.d);
            order.forEach(({ i }, rank) => {
              const t = order.length > 1 ? rank / (order.length - 1) - 0.5 : 0;
              worldDeltas[i] = axis.clone().multiplyScalar(t * spread);
            });
          }
          const parts: Part[] = meshes.map((mesh, i) => {
            const parent = mesh.parent!;
            const from = parent.worldToLocal(middle.clone());
            const to = parent.worldToLocal(middle.clone().add(worldDeltas[i]));
            return { mesh, base: mesh.position.clone(), delta: to.sub(from) };
          });
          const lift = Math.max(0, ...worldDeltas.map((d) => -d.y));
          const reach = Math.max(...worldDeltas.map((d) => d.length()));
          resolve({
            parts,
            lift,
            dolly: reach * 1.5,
            materials,
            hue,
            variants: JSON.parse(tab.dataset.variants || '[]'),
            variant: 0,
            group,
            meshes,
            height: size.y * scale,
            footprint: Math.max(size.x, size.z) * scale,
            tris: Math.round(tris),
            overlays: null,
          });
        },
        (e) => {
          if (e.total) status.textContent = `${Math.round((e.loaded / e.total) * 100)}%`;
        },
        () => resolve(null),
      );
    });
    cache.set(src, job);
    return job;
  };

  const buildOverlays = (entry: Entry) =>
    (entry.overlays ??= (async () => {
      // Light meshes can carry stronger lines; dense ones would turn into a solid block
      const wire = new THREE.LineBasicMaterial({
        color: CORAL,
        transparent: true,
        opacity: Math.min(0.72, 0.26 * Math.sqrt(130000 / entry.tris)),
        depthWrite: false,
        toneMapped: false,
        clippingPlanes: [xrayClip],
      });
      for (const mesh of entry.meshes) {
        await nextTask(); // keep the page responsive between parts
        const lines = new THREE.LineSegments(buildLines(mesh.geometry), wire);
        const ghost = new THREE.Mesh(mesh.geometry, shell);
        ghost.renderOrder = 1;
        lines.renderOrder = 2;
        mesh.add(lines, ghost);
      }
    })());

  /* ---------- Sizing and the render loop (only while visible) ---------- */
  let current: Entry | null = null;

  let explodeTarget = 0;
  let explodeNow = 0;
  let baseDistance = 1;

  const applyExplode = (entry: Entry) => {
    const p = explodeNow;
    entry.parts.forEach((part) => part.mesh.position.copy(part.base).addScaledVector(part.delta, p));
    entry.group.position.y = entry.lift * p;
    controls.target.y = entry.height * 0.5 + entry.lift * p;
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, baseDistance * (1 + entry.dolly * p));
    shadow.scale.setScalar(entry.footprint * 1.5 * (1 + p));
    shadowMat.opacity = THREE.MathUtils.clamp(shadowBase * (1 - p * 0.5), 0, 1);
  };

  const frameCamera = (entry: Entry) => {
    const target = new THREE.Vector3(0, entry.height * 0.5, 0);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const need = (0.72 / Math.tan(fov / 2)) * Math.max(1, 1 / camera.aspect) * 1.06;
    controls.target.copy(target);
    camera.position.set(need * 0.62, entry.height * 0.5 + need * 0.22, need * 0.75);
    camera.lookAt(target);
    baseDistance = camera.position.distanceTo(target);
  };

  const fit = () => {
    const w = holder.clientWidth;
    const h = holder.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(fit).observe(holder);
  fit();

  let visible = true;
  let raf = 0;
  const frame = () => {
    raf = 0;
    if (!visible) return;
    if (current && Math.abs(explodeTarget - explodeNow) > 0.0005) {
      explodeNow += (explodeTarget - explodeNow) * 0.14;
      applyExplode(current);
    }
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    wake();
  }).observe(holder);

  /* ---------- Modes ---------- */
  let shadowBase = 1;
  let mode: 'render' | 'xray' = 'render';
  let tween: gsap.core.Tween | null = null;

  const paintScan = () => {
    applyScan();
    const h = current?.height ?? 1;
    scanRing.position.y = scanDisc.position.y = scan.y;
    const t = THREE.MathUtils.clamp(scan.y / h, 0, 1);
    const edge = Math.sin(Math.PI * t);
    (scanRing.material as THREE.LineBasicMaterial).opacity = edge;
    (scanDisc.material as THREE.MeshBasicMaterial).opacity = edge * 0.1;
    shadowBase = 1 - t * 0.8;
    shadowMat.opacity = shadowBase;
  };
  const scanEnd = (entry: Entry) => (mode === 'xray' ? entry.height * 1.02 : -entry.height * 0.02);
  // Past the model, so parts lifted or lowered by the exploded view are fully in one mode
  const scanFar = () => (mode === 'xray' ? 20 : -20);

  const setMode = async (next: 'render' | 'xray') => {
    if (next === mode || !current) return;
    mode = next;
    modes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modelMode === next)));
    root.classList.toggle('is-xray', next === 'xray');
    const entry = current;
    if (next === 'xray') {
      root.classList.add('is-building');
      await buildOverlays(entry);
      root.classList.remove('is-building');
      if (mode !== 'xray' || current !== entry) return;
    }
    tween?.kill();
    const settle = () => {
      scan.y = scanFar();
      paintScan();
    };
    if (reduced()) {
      settle();
      return;
    }
    scan.y = THREE.MathUtils.clamp(scan.y, -entry.height * 0.02, entry.height * 1.02);
    tween = gsap.to(scan, { y: scanEnd(entry), duration: 1.5, ease: 'power2.inOut', onUpdate: paintScan, onComplete: settle });
  };

  /* ---------- Colour swatches ---------- */
  const paintVariant = (entry: Entry, animate: boolean) => {
    const v = entry.variants[entry.variant];
    if (!v) return;
    const time = animate && !reduced() ? 0.55 : 0;
    entry.materials.forEach((m) => {
      const c = v.colors[m.name];
      if (c) gsap.to(m.color, { r: c[0], g: c[1], b: c[2], duration: time });
    });
    gsap.to(entry.hue, { value: THREE.MathUtils.degToRad(v.hue ?? 0), duration: time });
  };

  const buildSwatches = (entry: Entry) => {
    swatches.textContent = '';
    entry.variants.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', v.name);
      b.title = v.name;
      b.style.setProperty('--c', v.swatch);
      b.setAttribute('aria-pressed', String(i === entry.variant));
      b.addEventListener('click', () => {
        entry.variant = i;
        swatches.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        paintVariant(entry, true);
      });
      swatches.append(b);
    });
  };

  /* ---------- Exploded view: scroll, or the slider ---------- */
  const scroller = root.closest('dialog');
  scroller?.addEventListener(
    'scroll',
    () => {
      const room = wrap.offsetHeight - root.offsetHeight;
      if (room <= 0) return;
      const pinned = root.getBoundingClientRect().top - wrap.getBoundingClientRect().top;
      explodeTarget = THREE.MathUtils.clamp(pinned / room, 0, 1);
      explodeInput.value = String(Math.round(explodeTarget * 100));
      wake();
    },
    { passive: true },
  );
  explodeInput.addEventListener('input', () => {
    explodeTarget = Number(explodeInput.value) / 100;
    wake();
  });

  /* ---------- Switching models ---------- */
  let token = 0;

  const show = async (tab: HTMLButtonElement) => {
    const me = ++token;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
    holder.setAttribute('aria-label', tab.textContent!.trim());
    root.classList.remove('is-ready');
    modes.forEach((b) => (b.disabled = true));
    status.textContent = '';

    const entry = await load(tab);
    if (me !== token) return;
    if (!entry) {
      status.textContent = '×';
      if (!current) root.classList.add('is-failed');
      return;
    }
    if (mode === 'xray') {
      root.classList.add('is-building');
      await buildOverlays(entry);
      root.classList.remove('is-building');
      if (me !== token) return;
    }

    tween?.kill();
    if (current) {
      current.group.visible = false;
      current.parts.forEach((part) => part.mesh.position.copy(part.base));
      current.group.position.y = 0;
    }
    current = entry;
    entry.group.visible = true;
    scan.y = scanFar();

    const ring = entry.footprint * 0.62;
    scanRing.scale.set(ring, 1, ring);
    scanDisc.scale.set(ring, ring, 1);
    const shadowSize = entry.footprint * 1.5;
    shadow.scale.set(shadowSize, shadowSize, 1);
    paintScan();
    frameCamera(entry);
    controls.autoRotate = !reduced();
    applyExplode(entry);
    buildSwatches(entry);

    meshStat.textContent = entry.tris.toLocaleString(locale);
    partStat.textContent = entry.meshes.length.toLocaleString(locale);
    status.textContent = '';
    modes.forEach((b) => (b.disabled = false));
    explodeInput.disabled = false;
    root.classList.add('is-ready');
    wake();
  };

  tabs.forEach((t) => t.addEventListener('click', () => t.getAttribute('aria-pressed') !== 'true' && show(t)));
  modes.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.modelMode as 'render' | 'xray')));

  await show(tabs[0]);
}
