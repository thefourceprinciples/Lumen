import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const container = document.getElementById('avatar-stage');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x060913, 0.045);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 1.2, 6.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.8;
controls.maxDistance = 12;

// Post-Processing: UnrealBloomPass for HDR volumetric glow
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(container.clientWidth, container.clientHeight),
  1.15, // strength
  0.55, // radius
  0.25  // threshold
);
composer.addPass(bloomPass);

// Lighting
const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
scene.add(ambientLight);
const coreLight = new THREE.PointLight(0x38bdf8, 6, 15);
coreLight.position.set(0, 1.5, 1.5);
scene.add(coreLight);

// PBR Materials
const holoMat = new THREE.MeshPhysicalMaterial({
  color: 0x38bdf8,
  emissive: 0x0284c7,
  emissiveIntensity: 0.9,
  roughness: 0.2,
  metalness: 0.6,
  wireframe: false,
  transparent: true,
  opacity: 0.88
});

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x7dd3fc,
  wireframe: true,
  transparent: true,
  opacity: 0.35
});

const coreMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0x38bdf8,
  emissiveIntensity: 2.5
});

// --- 1. CHARACTER RIG ---
const charGroup = new THREE.Group();
const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 2), holoMat);
head.position.y = 1.45;
charGroup.add(head);

const torso = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.1, 8, 1, true), holoMat);
torso.position.y = 0.1;
charGroup.add(torso);

const torsoWire = new THREE.Mesh(new THREE.ConeGeometry(0.78, 2.15, 8, 2, true), wireMat);
torsoWire.position.y = 0.1;
charGroup.add(torsoWire);

const heartCore = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), coreMat);
heartCore.position.y = 0.72;
charGroup.add(heartCore);

// Persona Accessories
const oracleHalo = new THREE.Group();
for (let i = 0; i < 12; i++) {
  const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.005, 0.65, 6), coreMat);
  const angle = (i / 12) * Math.PI * 2;
  ray.position.set(Math.cos(angle) * 0.78, 1.45 + Math.sin(angle) * 0.78, -0.15);
  ray.rotation.z = angle - Math.PI / 2;
  oracleHalo.add(ray);
}
charGroup.add(oracleHalo);

const detectiveGear = new THREE.Group();
const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 0.04, 24), holoMat);
brim.position.set(0, 1.72, 0);
brim.rotation.z = -0.08;
detectiveGear.add(brim);
const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 12, 24), coreMat);
lensRing.position.set(0.85, 0.85, 0.45);
detectiveGear.add(lensRing);
charGroup.add(detectiveGear);

const engineerRings = new THREE.Group();
for (let r = 0; r < 2; r++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85 + r * 0.25, 0.018, 12, 36), coreMat);
  ring.position.y = 1.45;
  ring.rotation.x = Math.PI / 2.4 + r * 0.4;
  engineerRings.add(ring);
}
charGroup.add(engineerRings);
scene.add(charGroup);

// --- 2. ORB RIG ---
const orbGroup = new THREE.Group();
const orbCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 2), coreMat);
orbGroup.add(orbCore);
for (let i = 0; i < 3; i++) {
  const gyro = new THREE.Mesh(new THREE.TorusGeometry(0.85 + i * 0.28, 0.025, 16, 48), holoMat);
  gyro.rotation.set(i * 0.7, i * 0.5, 0);
  orbGroup.add(gyro);
}
scene.add(orbGroup);

// --- 3. LANTERN RIG ---
const lanternGroup = new THREE.Group();
const lanternFrame = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), wireMat);
lanternGroup.add(lanternFrame);
const lanternShell = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 1.3, 6, 1, true), holoMat);
lanternGroup.add(lanternShell);
const lanternFlame = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 1), coreMat);
lanternGroup.add(lanternFlame);
scene.add(lanternGroup);

// --- 4. RUNNING FOX RIG (Hoshi Nine-Tails) ---
const foxGroup = new THREE.Group();
const foxBody = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.35, 6), holoMat);
foxBody.rotation.z = Math.PI / 2;
foxGroup.add(foxBody);
const foxHead = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 5), coreMat);
foxHead.position.set(0.85, 0.28, 0);
foxHead.rotation.z = -Math.PI / 3;
foxGroup.add(foxHead);

const foxTails = [];
for (let tIdx = 0; tIdx < 7; tIdx++) {
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.11, 1.2, 6), holoMat);
  const spread = (tIdx - 3) * 0.24;
  tail.position.set(-0.95, 0.15 + Math.abs(spread) * 0.2, spread * 1.1);
  tail.rotation.z = Math.PI / 2.2;
  tail.rotation.y = spread;
  foxGroup.add(tail);
  foxTails.push(tail);
}
scene.add(foxGroup);

// --- 2,000 HDR AMBIENT & MORPH PARTICLES ---
const particleCount = 1800;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 14;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({ size: 0.045, color: 0x38bdf8, transparent: true, opacity: 0.75 });
const particleField = new THREE.Points(particleGeo, particleMat);
scene.add(particleField);

// Color Palette Sync
const PALETTES = {
  base: 0x38bdf8,
  detective: 0xf59e0b,
  engineer: 0x22d3ee,
  oracle: 0xfde047
};

window.addEventListener('resize', () => {
  if (!container.clientWidth || !container.clientHeight) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  composer.setSize(container.clientWidth, container.clientHeight);
});

let clock = 0;
function animate() {
  requestAnimationFrame(animate);
  clock += 0.025;
  controls.update();

  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked' };
  const targetHex = PALETTES[st.persona] || 0x38bdf8;
  holoMat.color.setHex(targetHex);
  holoMat.emissive.setHex(targetHex);
  coreMat.emissive.setHex(targetHex);
  coreLight.color.setHex(targetHex);
  particleMat.color.setHex(targetHex);

  // Toggle visibility by active form
  charGroup.visible = st.form === 'character';
  orbGroup.visible = st.form === 'orb';
  lanternGroup.visible = st.form === 'lantern';
  foxGroup.visible = st.form === 'fox';

  // Persona accessories
  oracleHalo.visible = st.persona === 'oracle';
  detectiveGear.visible = st.persona === 'detective';
  engineerRings.visible = st.persona === 'engineer';

  // Form animations
  if (charGroup.visible) {
    charGroup.position.y = Math.sin(clock * 1.5) * 0.14;
    charGroup.rotation.y = Math.sin(clock * 0.5) * 0.25;
    oracleHalo.rotation.z = clock * 0.4;
    engineerRings.children[0].rotation.y = clock * 1.1;
    engineerRings.children[1].rotation.x = -clock * 0.9;
  } else if (orbGroup.visible) {
    orbGroup.children[1].rotation.x = clock * 1.6;
    orbGroup.children[2].rotation.y = -clock * 1.4;
    orbGroup.children[3].rotation.z = clock * 1.8;
    orbGroup.position.x = st.layout === 'roam' ? Math.cos(clock * 0.8) * 1.8 : 0;
    orbGroup.position.y = Math.sin(clock * 1.3) * 0.4;
  } else if (lanternGroup.visible) {
    lanternGroup.position.y = Math.sin(clock * 1.8) * 0.18;
    lanternGroup.rotation.y = clock * 0.6;
    const pulse = 1 + Math.sin(clock * 5) * 0.18;
    lanternFlame.scale.set(pulse, pulse, pulse);
  } else if (foxGroup.visible) {
    const orbitAngle = clock * 1.2;
    foxGroup.position.set(Math.cos(orbitAngle) * 1.8, Math.sin(clock * 6) * 0.22, Math.sin(orbitAngle) * 1.2);
    foxGroup.rotation.y = -orbitAngle - Math.PI / 2;
    foxTails.forEach((tail, idx) => {
      tail.rotation.x = Math.sin(clock * 6 + idx * 0.5) * 0.28;
    });
  }

  particleField.rotation.y = clock * 0.08;
  composer.render();
}

animate();
