import * as THREE from 'three';
import profiles from './profiles.json';

const TAU = Math.PI * 2;
const RINGS = 76;
const SEGMENTS = 96;
const SAMPLES = Object.fromEntries(Object.entries(profiles).map(([name, profile]) => {
  const curve = new THREE.CatmullRomCurve3(
    profile.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'catmullrom', 0.48,
  );
  return [name, curve.getPoints(RINGS)];
}));

const PALETTES = {
  clay: { dark: [101, 75, 60], light: [145, 114, 91], roughness: .91, bump: .023 },
  fired: { dark: [116, 53, 33], light: [199, 112, 71], roughness: .68, bump: .033 },
  ash: { dark: [59, 72, 49], light: [167, 173, 120], roughness: .40, bump: .018 },
  rice: { dark: [119, 101, 76], light: [223, 210, 177], roughness: .53, bump: .029 },
  iron: { dark: [92, 52, 43], light: [161, 97, 72], roughness: .43, bump: .017 },
};

function canvasTexture(size, draw, color = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ceramicMaterial(name) {
  const palette = PALETTES[name];
  const glazed = !['clay','fired'].includes(name);
  const textureContrast = name === 'ash' ? .80 : .53;
  const size = 384;
  const surface = document.createElement('canvas');
  const relief = document.createElement('canvas');
  surface.width = surface.height = relief.width = relief.height = size;
  const surfaceContext = surface.getContext('2d');
  const reliefContext = relief.getContext('2d');
  const color = surfaceContext.createImageData(size, size);
  const height = reliefContext.createImageData(size, size);
  let seed = 18427;
  for (let y = 0; y < size; y++) {
    const v = 1 - y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const angle = u * TAU;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const streak = Math.sin(v * 180 + .8 * Math.sin(angle * 3) + .3 * Math.sin(angle * 13));
      const variation = .17 * Math.sin(angle * 4 + v * 21)
        + .12 * Math.cos(angle * 9 - v * 23) + .08 * Math.sin(angle * 17 + v * 69);
      const cloud = .5 + variation * textureContrast * (1 - THREE.MathUtils.smoothstep(v, .88, .995));
      const pools = THREE.MathUtils.smoothstep(v, .15 + cloud * .12, .26 + cloud * .11);
      const foot = glazed ? 1 - pools : 0;
      const speck = noise > .988 ? 36 + (noise - .988) * 1700 : 0;
      const pixel = (y * size + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        const base = THREE.MathUtils.lerp(palette.dark[channel], palette.light[channel], cloud);
        color.data[pixel + channel] = THREE.MathUtils.lerp(base, [129, 87, 62][channel], foot)
          + streak * (glazed ? 3.5 : 2) + (noise - .5) * 17 - speck;
      }
      color.data[pixel + 3] = 255;
      height.data[pixel] = 125 + streak * 26 + (noise - .5) * 49 - speck * .32;
      height.data[pixel + 1] = glazed ? 120 + foot * 105 + cloud * 60 : 229 + cloud * 20;
      height.data[pixel + 2] = height.data[pixel];
      height.data[pixel + 3] = 255;
    }
  }
  surfaceContext.putImageData(color, 0, 0);
  reliefContext.putImageData(height, 0, 0);
  const map = new THREE.CanvasTexture(surface);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(relief);
  map.wrapS = bumpMap.wrapS = THREE.RepeatWrapping;
  return new THREE.MeshPhysicalMaterial({
    map, bumpMap, bumpScale: palette.bump, roughnessMap: bumpMap,
    roughness: palette.roughness, clearcoat: glazed ? .37 : 0,
    clearcoatRoughness: name === 'ash' ? .28 : .40,
    envMapIntensity: glazed ? .81 : .62,
  });
}

function studioLighting(renderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x33332a);
  const lights = [
    {position: [-4, 4, 3], width: 3.3, height: 4.2, color: 0xffe0ba, energy: 3.0},
    {position: [3, 3, -4], width: 3.7, height: 2.5, color: 0xcbd9f0, energy: 2.3},
    {position: [1, 6, 1], width: 2, height: 2.6, color: 0xffefdc, energy: 1.3},
  ];
  for (const { position, width, height, color, energy } of lights) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(energy)}),
    );
    panel.position.set(...position);
    panel.lookAt(0, .3, 0);
    room.add(panel);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .03, .1, 30);
  pmrem.dispose();
  for (const panel of room.children) {
    panel.geometry.dispose();
    panel.material.dispose();
  }
  return environment;
}

function vesselGeometry() {
  const length = (RINGS + 1) * (SEGMENTS + 1);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(length * 3), 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(length * 2), 2).setUsage(THREE.DynamicDrawUsage));
  const indices = [];
  for (let ring = 0; ring < RINGS; ring++) {
    for (let step = 0; step < SEGMENTS; step++) {
      const a = ring * (SEGMENTS + 1) + step;
      const b = a + SEGMENTS + 1;
      indices.push(a, b, a+1, b, b+1, a+1);
    }
  }
  geometry.setIndex(indices);
  return geometry;
}

const circle = Array.from({length: SEGMENTS + 1}, (_, i) => {
  const angle = (i % SEGMENTS) / SEGMENTS * TAU;
  return { angle, x: Math.cos(angle), z: Math.sin(angle) };
});

function shapeVessel(geometry, profile, hand) {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const maxHeight = profile.reduce((max, point) => Math.max(max, point.y), 0);
  const maxRadius = profile.reduce((max, point) => Math.max(max, point.x), 0);
  for (let ring = 0; ring <= RINGS; ring++) {
    const {x: radius, y} = profile[ring];
    const interior = THREE.MathUtils.smoothstep(ring / RINGS, .61, .81);
    const glazedInterior = interior * (.39 + .605 * (1 - Math.min(1, radius / maxRadius)));
    for (let step = 0; step <= SEGMENTS; step++) {
      const {angle, x, z} = circle[step];
      const index = ring * (SEGMENTS + 1) + step;
      const wobble = (hand ? .035 : .011) * Math.sin(3 * angle + y * 4)
        + .008 * Math.cos(7 * angle - y * 9);
      const thumbMark = hand ? .037 * Math.exp(-44 * (y-.64)**2 - 9 * (1-Math.cos(angle-1.05))) : 0;
      const r = Math.max(.0005, radius) * (1 + wobble - thumbMark);
      const h = Math.max(.012, y + radius * (.011 * Math.sin(3 * angle) + .004 * Math.sin(8 * angle + 2)));
      position.setXYZ(index, r * x, h, r * z);
      uv.setXY(index, step / SEGMENTS, Math.max(glazedInterior, Math.min(.999, h / (maxHeight * 1.08))));
    }
  }
  position.needsUpdate = true;
  uv.needsUpdate = true;
  geometry.computeVertexNormals();
  const normal = geometry.attributes.normal;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  for (let ring = 0; ring <= RINGS; ring++) {
    const start = ring * (SEGMENTS + 1);
    const end = start + SEGMENTS;
    a.fromBufferAttribute(normal, start).add(b.fromBufferAttribute(normal, end)).normalize();
    normal.setXYZ(start, a.x, a.y, a.z);
    normal.setXYZ(end, a.x, a.y, a.z);
  }
  normal.needsUpdate = true;
}

function shadow(radius, opacity, y) {
  const map = canvasTexture(96, (ctx, size) => {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(13, 9, 5, .9)');
    gradient.addColorStop(.48, 'rgba(13, 9, 5, .66)');
    gradient.addColorStop(1, 'rgba(13, 9, 5, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({map, opacity, transparent:true, depthWrite:false}));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  return mesh;
}

function wheelSurface() {
  const map = canvasTexture(256, (ctx, size) => {
    ctx.fillStyle = '#302a23';
    ctx.fillRect(0,0,size,size);
    for (let i=3; i<125; i+=3) {
      ctx.strokeStyle = i % 9 === 0 ? '#6c60504d' : '#9b896c28';
      ctx.beginPath();
      ctx.arc(size/2,size/2,i,0,TAU);
      ctx.stroke();
    }
  }, true);
  const wheel = new THREE.Group();
  const edge = new THREE.MeshStandardMaterial({color:0x353027, metalness:.53, roughness:.62});
  const face = new THREE.MeshStandardMaterial({map, metalness:.28, roughness:.69, bumpMap:map, bumpScale:.012});
  const rim = new THREE.LatheGeometry([
    [0,-.27],[1.25,-.27],[1.29,-.24],[1.29,-.14],[1.33,-.13],
    [1.36,-.10],[1.36,-.035],[1.33,0],
  ].map(([r,y]) => new THREE.Vector2(r,y)), 100);
  wheel.add(new THREE.Mesh(rim, edge));
  const top = new THREE.Mesh(new THREE.CircleGeometry(1.33,100),face);
  top.rotation.x = -Math.PI / 2;
  top.position.y = .001;
  wheel.add(top, shadow(.94, .86, .006));
  return wheel;
}

export function createStudio(canvas, {course = false, reducedMotion, onLost}) {
  const context = canvas.getContext('webgl2', {alpha:true, antialias:true, powerPreference:'low-power'});
  if (!context) throw new Error('WebGL2 unavailable');
  const renderer = new THREE.WebGLRenderer({canvas, context, alpha:true, antialias:true});
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const environment = studioLighting(renderer);
  scene.environment = environment.texture;
  scene.add(new THREE.HemisphereLight(0xffe7cc, 0x524e44, 1.0));
  const key = new THREE.DirectionalLight(0xffe1bd, 1.95);
  key.position.set(-4, 5, 3);
  const edge = new THREE.DirectionalLight(0xe2eaff, 1.10);
  edge.position.set(3, 3, -4);
  const kiln = new THREE.PointLight(0xff6525, 0, 5, 1.5);
  kiln.position.set(0, .1, 1.75);
  scene.add(key, edge, kiln);

  const wheel = wheelSurface();
  scene.add(wheel, shadow(1.84,.82,-.28));
  const geometry = vesselGeometry();
  const materials = new Map();
  function material(name) {
    if (!materials.has(name)) materials.set(name, ceramicMaterial(name));
    return materials.get(name);
  }
  const vessel = new THREE.Mesh(geometry, material(course ? 'rice' : 'ash'));
  vessel.frustumCulled = false;
  wheel.add(vessel);

  const camera = new THREE.OrthographicCamera(-2,2,1.5,-1.5,.1,30);
  const look = new THREE.Vector3(0,.31,0);
  const live = SAMPLES[course ? 'cup' : 'bowl'].map(point => point.clone());
  const target = live.map(point => point.clone());
  const from = live.map(point => point.clone());
  let angle = .45;
  let elevation = .49;
  let angleGoal = angle;
  let elevationGoal = elevation;
  let spin = 0;
  let spinUntil = 0;
  let fireUntil = 0;
  let firedMaterial = null;
  let shapeStart = 0;
  let shapeDuration = 0;
  let hand = course;
  let frame = 0;
  let last = 0;
  let visible = true;
  let lost = false;

  function render() {
    const radius = 6.4;
    camera.position.set(Math.sin(angle)*Math.cos(elevation)*radius,
      look.y+Math.sin(elevation)*radius, Math.cos(angle)*Math.cos(elevation)*radius);
    camera.lookAt(look);
    renderer.render(scene,camera);
  }

  function resize() {
    const {width,height} = canvas.parentElement.getBoundingClientRect();
    if (width < 1 || height < 1 || lost) return;
    const aspect = width / height;
    const span = Math.max(3.37, 2.56 * aspect);
    camera.left = -span / 2;
    camera.right = span / 2;
    camera.top = span / (2 * aspect);
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    render();
  }

  function tick(now) {
    frame = 0;
    if (!visible || lost || document.hidden) return;
    const dt = Math.min(50, now - (last || now));
    last = now;
    const instant = reducedMotion.matches;
    const ease = instant ? 1 : .22;
    angle += (angleGoal - angle) * ease;
    elevation += (elevationGoal - elevation) * ease;
    if (now < spinUntil && !instant) {
      spin += dt * .0018;
      wheel.rotation.y = spin;
    }
    const heating = now < fireUntil;
    kiln.intensity = heating ? 12 * Math.sin(Math.PI * (1 - (fireUntil-now)/1350)) : 0;
    if (firedMaterial && now >= fireUntil - 750) {
      vessel.material = firedMaterial;
      firedMaterial = null;
    }
    if (shapeDuration) {
      const progress = instant ? 1 : Math.min(1,(now-shapeStart)/shapeDuration);
      const t = 1 - Math.pow(1-progress, 3);
      for (let i=0; i<live.length; i++) live[i].lerpVectors(from[i],target[i],t);
      shapeVessel(geometry, live, hand);
      if (progress === 1) shapeDuration = 0;
    }
    render();
    if (shapeDuration || heating || now < spinUntil || Math.abs(angleGoal-angle) > .001 ||
      Math.abs(elevationGoal-elevation) > .001) {
      frame = requestAnimationFrame(tick);
    } else last = 0;
  }

  function schedule() {
    if (!frame && visible && !lost && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function update({profile = 'bowl', amount = 1, finish = 'ash', forming = false, firing = false, immediate = false}) {
    hand = profile === 'cup';
    const now = performance.now();
    const instant = immediate || reducedMotion.matches;
    const shape = SAMPLES[profile];
    for (let i=0; i<target.length; i++) {
      target[i].lerpVectors(SAMPLES.clay[i],shape[i],amount);
      from[i].copy(live[i]);
    }
    fireUntil = firing && !instant ? now+1350 : 0;
    const surface = material(finish);
    firedMaterial = fireUntil ? surface : null;
    vessel.material = fireUntil && !course ? material('clay') : surface;
    kiln.intensity = 0;
    spinUntil = forming && !instant ? now+1350 : 0;
    if (instant) {
      for (let i=0; i<live.length; i++) live[i].copy(target[i]);
      shapeVessel(geometry,live,hand);
      shapeDuration = 0;
    } else {
      shapeStart = now;
      shapeDuration = forming ? 270 : 580;
    }
    schedule();
  }

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    visibility.disconnect();
    document.removeEventListener('visibilitychange', schedule);
    onLost();
  }, {once:true});
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
  });
  visibility.observe(canvas.parentElement);
  document.addEventListener('visibilitychange', schedule);
  shapeVessel(geometry,live,hand);
  resize();

  return {
    update,
    orbit(delta) { angleGoal += delta; schedule(); },
    tilt(top) { elevationGoal = top ? 1.12 : .49; schedule(); },
  };
}
