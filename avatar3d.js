const container = document.getElementById('avatar-stage');
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.cursor = 'grab';
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

let rotY = 0;
let rotX = 0.15;
let zoom = 1.0;
let isDragging = false;
let lastMouse = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  canvas.style.cursor = 'grabbing';
  lastMouse = { x: e.clientX, y: e.clientY };
});
window.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  rotY += (e.clientX - lastMouse.x) * 0.01;
  rotX = Math.max(-0.8, Math.min(0.8, rotX + (e.clientY - lastMouse.y) * 0.01));
  lastMouse = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom = Math.max(0.55, Math.min(1.8, zoom - e.deltaY * 0.0008));
}, { passive: false });

function resize() {
  canvas.width = container.clientWidth || window.innerWidth * 0.45;
  canvas.height = container.clientHeight || window.innerHeight * 0.85;
}
window.addEventListener('resize', resize);
resize();

// 3D Projection Math
function project(x, y, z, cx, cy, scale) {
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

  const x1 = x * cosY - z * sinY;
  const z1 = z * cosY + x * sinY;
  const y2 = y * cosX - z1 * sinX;
  const z2 = z1 * cosX + y * sinX;

  const fov = 4.2;
  const depth = Math.max(0.4, fov + z2);
  const factor = (fov / depth) * scale * zoom;
  return { x: cx + x1 * factor, y: cy - y2 * factor, z: z2, s: factor };
}

function drawLine3D(p1, p2, cx, cy, scale, alpha = 0.85, width = 1.6) {
  const a = project(p1[0], p1[1], p1[2], cx, cy, scale);
  const b = project(p2[0], p2[1], p2[2], cx, cy, scale);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawRing3D(radius, yOffset, tiltX, tiltZ, segments, cx, cy, scale, alpha = 0.8) {
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    let px = Math.cos(theta) * radius;
    let py = 0;
    let pz = Math.sin(theta) * radius;

    // Tilt
    const ty = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
    const tz = pz * Math.cos(tiltX) + py * Math.sin(tiltX);
    const tx = px * Math.cos(tiltZ) - ty * Math.sin(tiltZ);
    const ty2 = ty * Math.cos(tiltZ) + px * Math.sin(tiltZ);

    const p = project(tx, ty2 + yOffset, tz, cx, cy, scale);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

// 900 Volumetric Ambient Particles
const particles = Array.from({ length: 900 }, () => ({
  x: (Math.random() - 0.5) * 4.5,
  y: (Math.random() - 0.5) * 4.5,
  z: (Math.random() - 0.5) * 4.5,
  phase: Math.random() * Math.PI * 2
}));

const PALETTES = {
  base: '#38bdf8',
  detective: '#f59e0b',
  engineer: '#22d3ee',
  oracle: '#fde047'
};

let t = 0;
function render() {
  t += 0.025;
  if (!isDragging) rotY += 0.006;

  const w = canvas.width;
  const h = canvas.height;
  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked' };
  const color = PALETTES[st.persona] || '#38bdf8';

  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter'; // HDR Additive Bloom Effect
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;

  const cx = st.layout === 'roam' ? w * 0.5 + Math.cos(t * 0.45) * (w * 0.15) : w * 0.5;
  const cy = st.layout === 'roam' ? h * 0.5 + Math.sin(t * 0.65) * (h * 0.12) : h * 0.52;
  const scale = Math.min(w, h) * 0.24;

  // Volumetric Ambient Particle Field
  particles.forEach((pt) => {
    const px = pt.x * Math.cos(t * 0.15) - pt.z * Math.sin(t * 0.15);
    const pz = pt.z * Math.cos(t * 0.15) + pt.x * Math.sin(t * 0.15);
    const proj = project(px, pt.y + Math.sin(t + pt.phase) * 0.08, pz, cx, cy, scale);
    if (proj.z > -3.5) {
      ctx.globalAlpha = Math.max(0.08, 0.45 - proj.z * 0.08);
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, Math.max(1, proj.s * 0.014), 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (st.form === 'orb') {
    // 3D Gyroscopic Harmonic Orb
    for (let i = 0; i < 4; i++) {
      drawRing3D(0.75 + i * 0.24, 0, t * (0.9 + i * 0.2), i * 0.65, 48, cx, cy, scale, 0.85);
    }
    const core = project(0, 0, 0, cx, cy, scale);
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(core.x, core.y, core.s * (0.28 + Math.sin(t * 4) * 0.04), 0, Math.PI * 2);
    ctx.fill();

  } else if (st.form === 'lantern') {
    // 3D Faceted Octahedral Lantern
    const bob = Math.sin(t * 2) * 0.12;
    const top = [0, 1.15 + bob, 0];
    const bot = [0, -1.05 + bob, 0];
    const r = 0.65;
    const ringPts = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + t * 0.5;
      ringPts.push([Math.cos(a) * r, 0.1 + bob, Math.sin(a) * r]);
    }
    for (let k = 0; k < 6; k++) {
      const next = ringPts[(k + 1) % 6];
      drawLine3D(top, ringPts[k], cx, cy, scale, 0.9, 2);
      drawLine3D(bot, ringPts[k], cx, cy, scale, 0.9, 2);
      drawLine3D(ringPts[k], next, cx, cy, scale, 0.9, 2);
    }
    const flame = project(0, 0.1 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(flame.x, flame.y, flame.s * (0.22 + Math.sin(t * 6) * 0.05), 0, Math.PI * 2);
    ctx.fill();

  } else if (st.form === 'fox') {
    // 3D Luminous Running Fox (Hoshi Nine-Tails)
    const stride = Math.sin(t * 6);
    const fx = Math.cos(t * 1.1) * 0.9;
    const fy = Math.sin(t * 6) * 0.14;
    const fz = Math.sin(t * 1.1) * 0.6;

    const nose = [fx + 0.95, fy + 0.18 + stride * 0.08, fz];
    const earL = [fx + 0.55, fy + 0.55, fz - 0.16];
    const earR = [fx + 0.55, fy + 0.55, fz + 0.16];
    const neck = [fx + 0.42, fy + 0.15, fz];
    const hip = [fx - 0.55, fy + 0.08 - stride * 0.06, fz];
    const chest = [fx + 0.25, fy - 0.22, fz];

    drawLine3D(nose, earL, cx, cy, scale, 0.95, 2.2);
    drawLine3D(nose, earR, cx, cy, scale, 0.95, 2.2);
    drawLine3D(earL, neck, cx, cy, scale, 0.9, 2);
    drawLine3D(earR, neck, cx, cy, scale, 0.9, 2);
    drawLine3D(nose, chest, cx, cy, scale, 0.9, 2);
    drawLine3D(neck, hip, cx, cy, scale, 0.95, 2.5);
    drawLine3D(chest, hip, cx, cy, scale, 0.85, 1.8);

    // 7 Flowing Luminous Tails
    for (let k = -3; k <= 3; k++) {
      const mid = [fx - 1.05, fy + 0.28 + Math.abs(k) * 0.08 + Math.sin(t * 6 + k) * 0.14, fz + k * 0.22];
      const tip = [fx - 1.65, fy + 0.18 + Math.abs(k) * 0.14 + Math.cos(t * 6 + k) * 0.2, fz + k * 0.36];
      drawLine3D(hip, mid, cx, cy, scale, 0.8, 1.8);
      drawLine3D(mid, tip, cx, cy, scale, 0.65, 1.4);
    }

  } else {
    // 3D Sculpted Character Silhouette + Persona Rig
    const bob = Math.sin(t * 1.8) * 0.08;
    const headPos = project(0, 1.05 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 0.92;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(headPos.x, headPos.y, headPos.s * 0.26, 0, Math.PI * 2);
    ctx.stroke();

    // 3D Conical Cloak Mesh
    const shoulders = [0, 0.72 + bob, 0];
    const basePts = [];
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      basePts.push([Math.cos(a) * 0.65, -0.95 + bob, Math.sin(a) * 0.65]);
    }
    for (let s = 0; s < 8; s++) {
      drawLine3D(shoulders, basePts[s], cx, cy, scale, 0.78, 1.8);
      drawLine3D(basePts[s], basePts[(s + 1) % 8], cx, cy, scale, 0.78, 1.8);
    }

    // Heart Core
    const heart = project(0, 0.22 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(heart.x, heart.y, heart.s * (0.14 + Math.sin(t * 4) * 0.03), 0, Math.PI * 2);
    ctx.fill();

    // Persona Accessories
    if (st.persona === 'oracle') {
      for (let r = 0; r < 12; r++) {
        const a = (r / 12) * Math.PI * 2 + t * 0.35;
        drawLine3D(
          [Math.cos(a) * 0.36, 1.05 + bob + Math.sin(a) * 0.36, -0.1],
          [Math.cos(a) * 0.72, 1.05 + bob + Math.sin(a) * 0.72, -0.1],
          cx, cy, scale, 0.9, 2
        );
      }
    } else if (st.persona === 'detective') {
      drawRing3D(0.55, 1.24 + bob, 0.12, -0.12, 32, cx, cy, scale, 0.95);
      drawRing3D(0.22, 0.35 + bob, 0.3, 0.2, 24, cx + scale * 0.55, cy, scale, 0.9);
    } else if (st.persona === 'engineer') {
      drawRing3D(0.68, 1.05 + bob, 0.35, Math.sin(t) * 0.3, 36, cx, cy, scale, 0.9);
      drawRing3D(0.88, 1.05 + bob, -0.35, Math.cos(t) * 0.3, 36, cx, cy, scale, 0.75);
    }
  }

  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(render);
}

render();
