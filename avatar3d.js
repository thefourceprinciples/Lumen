const container = document.getElementById('avatar-stage');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 600) / (container.clientHeight || 600), 0.1, 100);
camera.position.set(0, 1.1, 4.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth || 600, container.clientHeight || 600);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

// Studio & Rim Lighting for Metallic Gold, Ivory Armor & Obsidian Relief
const ambientLight = new THREE.AmbientLight(0x334155, 1.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
rimLight.position.set(-3, 2, -2);
scene.add(rimLight);

const emberLight = new THREE.PointLight(0xf59e0b, 1.8, 8);
emberLight.position.set(2, -1, 2);
scene.add(emberLight);

// Interactive Mouse Orbit & Wheel Zoom
let camYaw = 0, camPitch = 0.22, camDist = 4.4, isDragging = false, prevMouse = { x: 0, y: 0 };
renderer.domElement.style.cursor = 'grab';
renderer.domElement.addEventListener('mousedown', e => { isDragging = true; renderer.domElement.style.cursor = 'grabbing'; prevMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mouseup', () => { isDragging = false; renderer.domElement.style.cursor = 'grab'; });
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  camYaw -= (e.clientX - prevMouse.x) * 0.008;
  camPitch = Math.max(-0.5, Math.min(1.1, camPitch + (e.clientY - prevMouse.y) * 0.008));
  prevMouse = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); camDist = Math.max(2.4, Math.min(7.5, camDist + e.deltaY * 0.002)); }, { passive: false });

window.addEventListener('resize', () => {
  const w = container.clientWidth || 600, h = container.clientHeight || 600;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// PBR Materials
const matRusset   = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.65, metalness: 0.05 });
const matIvory    = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22, metalness: 0.15 });
const matGold     = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.20, metalness: 0.92, emissive: 0x78350f, emissiveIntensity: 0.35 });
const matObsidian = new THREE.MeshStandardMaterial({ color: 0x18151d, roughness: 0.35, metalness: 0.65, flatShading: true });
const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.70, metalness: 0.10 });
const matWhiteFur = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0.0 });
const matAmberEye = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 2.2 });
const matRedEye   = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 2.8 });
const matHoloWire = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.75 });
const matHoloCore = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.8, roughness: 0.2 });

const PALETTES = {
  base: 0x38bdf8, detective: 0xf59e0b, engineer: 0x22d3ee, oracle: 0xfde047,
  apothecary: 0x10b981, advocate: 0xa78bfa, architect: 0xf43f5e, strategist: 0x2dd4bf,
  pedagogue: 0x60a5fa, scholar: 0xfbbf24
};

// Astrolabe Observatory Base Rings
const baseGroup = new THREE.Group();
const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.30, 64), new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.35 }));
ring1.rotation.x = -Math.PI / 2; ring1.position.y = -1.15;
const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.85, 0.88, 48), new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
ring2.rotation.x = -Math.PI / 2; ring2.position.y = -1.15;
baseGroup.add(ring1, ring2);
scene.add(baseGroup);
const foxGroup = new THREE.Group();
const foxBody = new THREE.Group();
foxGroup.add(foxBody);

// 1. Ivory & Gold Biomechanical Torso Chassis
const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.92, 16), matIvory);
torsoMesh.rotation.z = Math.PI / 2;
foxBody.add(torsoMesh);

[-0.25, 0.0, 0.25].forEach(xPos => {
  const seam = new THREE.Mesh(new THREE.TorusGeometry(0.258, 0.016, 8, 24), matGold);
  seam.rotation.y = Math.PI / 2;
  seam.position.x = xPos;
  foxBody.add(seam);
});

// Plush White Chest Ruff & Gold Collar
const ruffMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), matWhiteFur);
ruffMesh.position.set(0.42, 0.04, 0);
ruffMesh.scale.set(0.95, 1.15, 0.95);
foxBody.add(ruffMesh);

const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 8, 24), matGold);
collarRing.position.set(0.36, 0.08, 0);
collarRing.rotation.set(0, Math.PI / 2, 0.35);
foxBody.add(collarRing);

// 2. Sculpted Chimeric Head (Left Russet vs. Right Jagged Obsidian Crest)
const headGroup = new THREE.Group();
headGroup.position.set(0.58, 0.32, 0);
foxBody.add(headGroup);

const skullLeft = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 16, 0, Math.PI), matRusset);
skullLeft.rotation.y = Math.PI;
headGroup.add(skullLeft);

const skullRight = new THREE.Mesh(new THREE.IcosahedronGeometry(0.225, 1), matObsidian);
skullRight.position.set(-0.01, 0.02, 0.04);
headGroup.add(skullRight);

const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.34, 12), matRusset);
muzzle.rotation.z = -Math.PI / 2;
muzzle.position.set(0.24, -0.04, 0);
headGroup.add(muzzle);

const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), matCharcoal);
noseTip.position.set(0.41, -0.04, 0);
headGroup.add(noseTip);

// Left Russet Ear + Right Obsidian Crest Horn
const earL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 8), matRusset);
earL.position.set(-0.04, 0.26, -0.11);
earL.rotation.x = -0.18;
const earR = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 6), matObsidian);
earR.position.set(-0.05, 0.25, 0.11);
earR.rotation.x = 0.22;
headGroup.add(earL, earR);

// Glowing Amber Left Eye & Crimson Right Eye
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), matAmberEye);
eyeL.position.set(0.15, 0.03, -0.11);
const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), matRedEye);
eyeR.position.set(0.15, 0.03, 0.11);
headGroup.add(eyeL, eyeR);

// 3. 4 Articulated Galloping Legs (Ivory/Gold Shoulders + Russet Thighs + Charcoal Lower Legs)
const foxLegs = [];
[
  { x: 0.32, z: -0.18, phase: 0 },
  { x: 0.32, z: 0.18, phase: Math.PI },
  { x: -0.38, z: -0.17, phase: Math.PI * 0.5 },
  { x: -0.38, z: 0.17, phase: Math.PI * 1.5 }
].forEach(cfg => {
  const hipPivot = new THREE.Group();
  hipPivot.position.set(cfg.x, -0.04, cfg.z);

  const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), matIvory);
  const goldTrim = new THREE.Mesh(new THREE.TorusGeometry(0.112, 0.012, 6, 16), matGold);
  goldTrim.rotation.y = Math.PI / 2;

  const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.048, 0.36, 10), matRusset);
  upperLeg.position.y = -0.18;

  const kneePivot = new THREE.Group();
  kneePivot.position.y = -0.36;
  const lowerLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.36, 10), matCharcoal);
  lowerLeg.position.y = -0.18;
  const paw = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), matCharcoal);
  paw.position.set(0.03, -0.36, 0);
  paw.scale.set(1.3, 0.7, 1.0);

  kneePivot.add(lowerLeg, paw);
  hipPivot.add(pauldron, goldTrim, upperLeg, kneePivot);
  foxBody.add(hipPivot);
  foxLegs.push({ hipPivot, kneePivot, phase: cfg.phase });
});

// 4. 9 Articulated 3D Spline Tails (4 Russet/White Fur + 5 Ivory/Gold Mechanical)
const foxTails = [];
for (let k = -4; k <= 4; k++) {
  const isMech = k > 0;
  const tailPivot = new THREE.Group();
  tailPivot.position.set(-0.46, 0.12, k * 0.035);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.32, 0.18 + Math.abs(k) * 0.05, k * 0.12),
    new THREE.Vector3(-0.68, 0.42 + Math.abs(k) * 0.08, k * 0.24),
    new THREE.Vector3(-0.98, 0.32 + Math.abs(k) * 0.10, k * 0.30)
  ]);
  const tubeGeo = new THREE.TubeGeometry(curve, 16, isMech ? 0.052 : 0.068, 10, false);
  const tailMesh = new THREE.Mesh(tubeGeo, isMech ? matIvory : matRusset);
  tailPivot.add(tailMesh);

  if (isMech) {
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.012, 6, 16), matGold);
    ringA.position.set(-0.32, 0.18 + Math.abs(k) * 0.05, k * 0.12);
    ringA.rotation.y = Math.PI / 2;
    const tipGold = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.18, 8), matGold);
    tipGold.position.set(-1.04, 0.30 + Math.abs(k) * 0.10, k * 0.31);
    tipGold.rotation.z = Math.PI * 0.62;
    tailPivot.add(ringA, tipGold);
  } else {
    const tipWhite = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.22, 10), matWhiteFur);
    tipWhite.position.set(-1.04, 0.30 + Math.abs(k) * 0.10, k * 0.31);
    tipWhite.rotation.z = Math.PI * 0.62;
    tailPivot.add(tipWhite);
  }

  foxBody.add(tailPivot);
  foxTails.push({ tailPivot, idx: k });
}
scene.add(foxGroup);
// Holographic Character, Orb & Lantern Meshes
const holoGroup = new THREE.Group();
scene.add(holoGroup);

const charMesh = new THREE.Group();
const headSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), matHoloWire);
headSphere.position.y = 1.05;
const cloakCone = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.75, 12, 3, true), matHoloWire);
cloakCone.position.y = -0.05;
const heartCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), matHoloCore);
heartCore.position.y = 0.35;
const personaHalo = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.018, 8, 48), matHoloCore);
personaHalo.position.y = 1.05;
personaHalo.rotation.x = Math.PI * 0.35;
charMesh.add(headSphere, cloakCone, heartCore, personaHalo);
holoGroup.add(charMesh);

const orbMesh = new THREE.Group();
for (let i = 0; i < 3; i++) {
  const gyro = new THREE.Mesh(new THREE.TorusGeometry(0.65 + i * 0.22, 0.015, 8, 48), matHoloCore);
  gyro.rotation.set(i * 0.8, i * 0.5, 0);
  orbMesh.add(gyro);
}
const orbCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), matHoloWire);
orbMesh.add(orbCore);
holoGroup.add(orbMesh);

const lanternMesh = new THREE.Group();
const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.38, 1.25, 8, 1, true), matHoloWire);
const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), matHoloCore);
lanternMesh.add(cage, flame);
holoGroup.add(lanternMesh);

// 3D Stardust Particle Field
const starCount = 260;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 7.5;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xfbbf24, size: 0.045, transparent: true, opacity: 0.8 });
const starField = new THREE.Points(starGeo, starMat);
scene.add(starField);

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.025;
  if (!isDragging) camYaw += 0.004;

  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked' };
  const hex = PALETTES[st.persona] || 0x38bdf8;
  matHoloWire.color.setHex(hex);
  matHoloCore.color.setHex(hex);
  matHoloCore.emissive.setHex(hex);
  rimLight.color.setHex(hex);
  ring1.material.color.setHex(hex);
  ring2.material.color.setHex(hex);

  // Camera Orbit Position
  camera.position.x = Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  camera.position.y = Math.sin(camPitch) * camDist + 0.25;
  camera.position.z = Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  camera.lookAt(0, 0.1, 0);

  starField.rotation.y = t * 0.08;

  // Toggle Form Visibility & Animate
  foxGroup.visible = (st.form === 'fox');
  charMesh.visible = (st.form === 'character');
  orbMesh.visible = (st.form === 'orb');
  lanternMesh.visible = (st.form === 'lantern');

  if (st.form === 'fox') {
    const orbit = t * 1.15;
    const gallop = Math.sin(t * 9);
    foxGroup.position.set(Math.cos(orbit) * 1.15, Math.abs(gallop) * 0.14 - 0.25, Math.sin(orbit) * 0.95);
    foxGroup.rotation.y = -orbit - Math.PI / 2;
    foxBody.rotation.z = gallop * 0.08;

    foxLegs.forEach(l => {
      const s = Math.sin(t * 9 + l.phase);
      l.hipPivot.rotation.z = s * 0.55;
      l.kneePivot.rotation.z = Math.max(0, -s) * 0.75;
    });

    foxTails.forEach(tl => {
      tl.tailPivot.rotation.y = Math.sin(t * 6 + tl.idx * 0.6) * 0.18;
      tl.tailPivot.rotation.z = Math.cos(t * 5 + tl.idx * 0.5) * 0.12;
    });
  } else if (st.form === 'orb') {
    orbMesh.rotation.y = t * 0.8;
    orbMesh.children.forEach((c, idx) => { c.rotation.x += 0.01 * (idx + 1); c.rotation.y += 0.015; });
  } else if (st.form === 'lantern') {
    lanternMesh.position.y = Math.sin(t * 2) * 0.12;
    lanternMesh.rotation.y = t * 0.6;
    flame.scale.setScalar(0.9 + Math.sin(t * 7) * 0.15);
  } else {
    charMesh.position.y = Math.sin(t * 1.8) * 0.08;
    personaHalo.rotation.z = t * 0.5;
    heartCore.rotation.y = t * 1.5;
  }

  renderer.render(scene, camera);
}
animate();
