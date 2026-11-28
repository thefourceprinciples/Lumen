const container = document.getElementById('avatar-stage');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight), 0.1, 100);
camera.position.set(0, 1.1, 4.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x334155, 1.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x34d399, 2.5, 12);
rimLight.position.set(-3, 2, -2);
scene.add(rimLight);

const emberLight = new THREE.PointLight(0xf59e0b, 1.8, 8);
emberLight.position.set(2, -1, 2);
scene.add(emberLight);

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

function syncStageSize() {
  const isRoam = document.body.classList.contains('layout-roam');
  const w = isRoam ? window.innerWidth : (container.clientWidth || 600);
  const h = isRoam ? (window.innerHeight - 54) : (container.clientHeight || 600);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', syncStageSize);

const matHoloWire = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.75 });
const matHoloCore = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x34d399, emissiveIntensity: 1.8, roughness: 0.2 });

const PALETTES = {
  base: 0x34d399, detective: 0xf59e0b, engineer: 0x38bdf8, oracle: 0xfde047,
  apothecary: 0x10b981, advocate: 0xc084fc, architect: 0xfb7185, strategist: 0x2dd4bf,
  pedagogue: 0x60a5fa, scholar: 0xfbbf24
};
const baseGroup = new THREE.Group();
const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.30, 64), new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.35 }));
ring1.rotation.x = -Math.PI / 2; ring1.position.y = -1.15;
const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.85, 0.88, 48), new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
ring2.rotation.x = -Math.PI / 2; ring2.position.y = -1.15;
baseGroup.add(ring1, ring2);
scene.add(baseGroup);

const holoGroup = new THREE.Group();
scene.add(holoGroup);

const charMesh = new THREE.Group();
const headSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), matHoloWire);
headSphere.position.y = 1.05;
const cloakCone = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.75, 16, 3, true), matHoloWire);
cloakCone.position.y = -0.05;
const heartCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), matHoloCore);
heartCore.position.y = 0.35;
charMesh.add(headSphere, cloakCone, heartCore);

const personaRigs = {};
function makeRig(name) { const g = new THREE.Group(); g.visible = false; charMesh.add(g); personaRigs[name] = g; return g; }

const rigBase = makeRig('base');
const baseHalo = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.016, 8, 48), matHoloCore);
baseHalo.position.y = 1.05; baseHalo.rotation.x = Math.PI * 0.35;
rigBase.add(baseHalo);

const rigDet = makeRig('detective');
const hatBrim = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.56, 32), matHoloWire);
hatBrim.position.y = 1.22; hatBrim.rotation.set(Math.PI * 0.45, 0.15, -0.1);
const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.018, 8, 32), matHoloCore);
lensRing.position.set(0.68, 0.45, 0.35);
rigDet.add(hatBrim, lensRing);

const rigEng = makeRig('engineer');
const engRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.015, 8, 48), matHoloCore);
const engRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.015, 8, 48), matHoloWire);
engRing1.position.y = 1.05; engRing2.position.y = 1.05;
rigEng.add(engRing1, engRing2);

const rigOra = makeRig('oracle');
for (let r = 0; r < 16; r++) {
  const a = (r / 16) * Math.PI * 2;
  const len = r % 2 === 0 ? 0.42 : 0.26;
  const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, len, 6), matHoloCore);
  ray.position.set(Math.cos(a) * (0.38 + len * 0.5), 1.05 + Math.sin(a) * (0.38 + len * 0.5), -0.1);
  ray.rotation.z = a - Math.PI / 2;
  rigOra.add(ray);
}

const rigApo = makeRig('apothecary');
for (let i = 0; i < 12; i++) {
  const y = -0.65 + i * 0.15, a = i * 0.55;
  const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.5, 6), matHoloWire);
  rung.position.y = y; rung.rotation.set(0, a, Math.PI / 2);
  const nodeA = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), matHoloCore);
  nodeA.position.set(Math.cos(a) * 0.75, y, Math.sin(a) * 0.75);
  const nodeB = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), matHoloCore);
  nodeB.position.set(-Math.cos(a) * 0.75, y, -Math.sin(a) * 0.75);
  rigApo.add(rung, nodeA, nodeB);
}

const rigAdv = makeRig('advocate');
const scaleBeam = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.03, 0.03), matHoloCore);
scaleBeam.position.y = 0.78;
const panL = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.014, 8, 24), matHoloWire);
panL.position.set(-0.82, 0.48, 0); panL.rotation.x = Math.PI / 2;
const panR = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.014, 8, 24), matHoloWire);
panR.position.set(0.82, 0.48, 0); panR.rotation.x = Math.PI / 2;
rigAdv.add(scaleBeam, panL, panR);

const rigArc = makeRig('architect');
const pent1 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.016, 6, 5), matHoloCore);
const pent2 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.016, 6, 5), matHoloWire);
pent1.position.y = 0.3; pent2.position.y = 0.3;
rigArc.add(pent1, pent2);

const rigStr = makeRig('strategist');
const gridHelper = new THREE.GridHelper(2.2, 8, 0x2dd4bf, 0x2dd4bf);
gridHelper.position.y = -0.95;
rigStr.add(gridHelper);

const rigPed = makeRig('pedagogue');
const shell1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), matHoloWire);
const shell2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, 1), matHoloWire);
shell1.position.y = 0.3; shell2.position.y = 0.3;
rigPed.add(shell1, shell2);

const rigSch = makeRig('scholar');
const astro1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.016, 8, 48), matHoloCore);
const astro2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.014, 8, 48), matHoloWire);
astro1.position.y = 0.45; astro2.position.y = 0.45;
const codexL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.02, 0.52), matHoloCore);
codexL.position.set(-0.2, 0.25, 0.55); codexL.rotation.set(0.35, 0, -0.2);
const codexR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.02, 0.52), matHoloCore);
codexR.position.set(0.2, 0.25, 0.55); codexR.rotation.set(0.35, 0, 0.2);
rigSch.add(astro1, astro2, codexL, codexR);
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

const fireflyCanvas = document.createElement('canvas');
fireflyCanvas.width = 64;
fireflyCanvas.height = 64;
const fCtx = fireflyCanvas.getContext('2d');
const fGrad = fCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
fGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
fGrad.addColorStop(0.35, 'rgba(255, 250, 210, 0.75)');
fGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
fCtx.fillStyle = fGrad;
fCtx.fillRect(0, 0, 64, 64);
const fireflyTexture = new THREE.CanvasTexture(fireflyCanvas);

const starCount = 240;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
const starVel = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.15 + Math.random() * 2.15;
  starPos[i * 3] = Math.cos(angle) * radius;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
  starPos[i * 3 + 2] = Math.sin(angle) * radius;

  starVel[i * 3] = (Math.random() - 0.5) * 0.018;
  starVel[i * 3 + 1] = 0.006 + Math.random() * 0.014;
  starVel[i * 3 + 2] = (Math.random() - 0.5) * 0.018;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xfbbf24, size: 0.068, map: fireflyTexture,
  transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending
});
const starField = new THREE.Points(starGeo, starMat);
scene.add(starField);

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.016;
  if (!isDragging) camYaw += 0.0022;

  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked', porchMode: false };
  const hex = PALETTES[st.persona] || 0x34d399;
  matHoloWire.color.setHex(hex);
  matHoloCore.color.setHex(hex);
  matHoloCore.emissive.setHex(hex);
  rimLight.color.setHex(hex);
  ring1.material.color.setHex(hex);
  ring2.material.color.setHex(hex);
  starMat.color.setHex(st.porchMode ? 0xfbbf24 : hex);

  const isRoam = (st.layout === 'roam');
  const roamX = isRoam ? Math.cos(t * 0.45) * 1.15 : 0;
  const roamY = isRoam ? Math.sin(t * 0.65) * 0.42 : 0;
  const roamZ = isRoam ? Math.sin(t * 0.35) * 0.75 : 0;

  baseGroup.position.set(roamX, roamY, roamZ);
  holoGroup.position.set(roamX, roamY, roamZ);

  camera.position.x = Math.sin(camYaw) * Math.cos(camPitch) * camDist;
  camera.position.y = Math.sin(camPitch) * camDist + 0.25;
  camera.position.z = Math.cos(camYaw) * Math.cos(camPitch) * camDist;
  camera.lookAt(0, 0.1, 0);

  // Fast organic firefly drift + camera lens exclusion zone (prevents giant foreground blobs)
  const posAttr = starGeo.attributes.position;
  for (let i = 0; i < starCount; i++) {
    const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
    starPos[ix] += starVel[ix] + Math.sin(t * 2.2 + i) * 0.004;
    starPos[iy] += starVel[iy];
    starPos[iz] += starVel[iz] + Math.cos(t * 1.9 + i) * 0.004;

    if (starPos[iy] > 1.75) starPos[iy] = -1.65;
    const rHoriz = Math.hypot(starPos[ix], starPos[iz]);
    if (rHoriz > 3.4 || rHoriz < 0.75) {
      const a = Math.random() * Math.PI * 2;
      const rNew = 1.2 + Math.random() * 1.9;
      starPos[ix] = Math.cos(a) * rNew;
      starPos[iz] = Math.sin(a) * rNew;
    }

    // Keep spores at least 1.55 units away from the camera lens
    const dx = starPos[ix] - camera.position.x;
    const dy = starPos[iy] - camera.position.y;
    const dz = starPos[iz] - camera.position.z;
    const distToCam = Math.hypot(dx, dy, dz);
    if (distToCam < 1.55) {
      starPos[ix] = -starPos[ix];
      starPos[iz] = -starPos[iz];
    }
  }
  posAttr.needsUpdate = true;
  starField.rotation.y = t * 0.22;
  starField.visible = true;

  baseGroup.visible = !st.porchMode;
  holoGroup.visible = !st.porchMode;
  charMesh.visible = (st.form === 'character');
  orbMesh.visible = (st.form === 'orb');
  lanternMesh.visible = (st.form === 'lantern');

  if (st.form === 'orb') {
    orbMesh.rotation.y = t * 0.8;
    orbMesh.children.forEach((c, idx) => { c.rotation.x += 0.01 * (idx + 1); c.rotation.y += 0.015; });
  } else if (st.form === 'lantern') {
    lanternMesh.position.y = Math.sin(t * 2) * 0.12;
    lanternMesh.rotation.y = t * 0.6;
    flame.scale.setScalar(0.9 + Math.sin(t * 7) * 0.15);
  } else {
    charMesh.position.y = Math.sin(t * 1.8) * 0.08;
    heartCore.rotation.y = t * 1.5;

    Object.keys(personaRigs).forEach(k => { personaRigs[k].visible = (k === st.persona); });
    if (st.persona === 'base') baseHalo.rotation.z = t * 0.5;
    if (st.persona === 'detective') lensRing.rotation.y = Math.sin(t * 1.5) * 0.5;
    if (st.persona === 'engineer') { engRing1.rotation.set(t * 0.8, t * 0.4, 0); engRing2.rotation.set(-t * 0.6, 0, t * 0.5); }
    if (st.persona === 'oracle') rigOra.rotation.z = t * 0.25;
    if (st.persona === 'apothecary') rigApo.rotation.y = t * 0.9;
    if (st.persona === 'advocate') rigAdv.rotation.z = Math.sin(t * 1.4) * 0.08;
    if (st.persona === 'architect') { pent1.rotation.set(t * 0.5, t * 0.3, 0); pent2.rotation.set(-t * 0.4, 0, t * 0.4); }
    if (st.persona === 'pedagogue') { shell1.rotation.y = t * 0.4; shell2.rotation.y = -t * 0.25; }
    if (st.persona === 'scholar') { astro1.rotation.set(t * 0.4, 0.35, 0); astro2.rotation.set(-t * 0.3, -0.35, 0); }
  }

  renderer.render(scene, camera);
}
animate();
