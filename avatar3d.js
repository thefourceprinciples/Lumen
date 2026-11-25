const container = document.getElementById('avatar-stage');
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.cursor = 'grab';
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

let rotY = 0, rotX = 0.15, zoom = 1.0, isDragging = false, lastMouse = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => { isDragging = true; canvas.style.cursor = 'grabbing'; lastMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = 'grab'; });
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  rotY += (e.clientX - lastMouse.x) * 0.01;
  rotX = Math.max(-0.8, Math.min(0.8, rotX + (e.clientY - lastMouse.y) * 0.01));
  lastMouse = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.max(0.55, Math.min(1.8, zoom - e.deltaY * 0.0008)); }, { passive: false });

function resize() {
  canvas.width = container.clientWidth || window.innerWidth * 0.45;
  canvas.height = container.clientHeight || window.innerHeight * 0.85;
}
window.addEventListener('resize', resize);
resize();

function project(x, y, z, cx, cy, scale) {
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const x1 = x * cosY - z * sinY, z1 = z * cosY + x * sinY;
  const y2 = y * cosX - z1 * sinX, z2 = z1 * cosX + y * sinX;
  const fov = 4.2, depth = Math.max(0.4, fov + z2);
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
    const px = Math.cos(theta) * radius, pz = Math.sin(theta) * radius;
    const ty = -pz * Math.sin(tiltX), tz = pz * Math.cos(tiltX);
    const tx = px * Math.cos(tiltZ) - ty * Math.sin(tiltZ);
    const ty2 = ty * Math.cos(tiltZ) + px * Math.sin(tiltZ);
    const p = project(tx, ty2 + yOffset, tz, cx, cy, scale);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

const particles = Array.from({ length: 240 }, () => ({
  x: (Math.random() - 0.5) * 4.5, y: (Math.random() - 0.5) * 4.5, z: (Math.random() - 0.5) * 4.5, phase: Math.random() * Math.PI * 2
}));

const PALETTES = {
  base: '#38bdf8', detective: '#f59e0b', engineer: '#22d3ee', oracle: '#fde047',
  apothecary: '#10b981', advocate: '#a78bfa', architect: '#f43f5e', strategist: '#2dd4bf', pedagogue: '#60a5fa'
};

let t = 0;
function render() {
  t += 0.025;
  if (!isDragging) rotY += 0.006;
  const w = canvas.width, h = canvas.height;
  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked' };
  const color = PALETTES[st.persona] || '#38bdf8';

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = color; ctx.fillStyle = color;
  const cx = st.layout === 'roam' ? w * 0.5 + Math.cos(t * 0.45) * (w * 0.15) : w * 0.5;
  const cy = st.layout === 'roam' ? h * 0.5 + Math.sin(t * 0.65) * (h * 0.12) : h * 0.52;
  const scale = Math.min(w, h) * 0.24;

  ctx.shadowBlur = 0;
  const cosT = Math.cos(t * 0.15), sinT = Math.sin(t * 0.15);
  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
    const proj = project(pt.x * cosT - pt.z * sinT, pt.y + Math.sin(t + pt.phase) * 0.08, pt.z * cosT + pt.x * sinT, cx, cy, scale);
    if (proj.z > -3.5) {
      ctx.globalAlpha = Math.max(0.1, 0.55 - proj.z * 0.1);
      const size = Math.max(1.2, proj.s * 0.015);
      ctx.fillRect(proj.x, proj.y, size, size);
    }
  }

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = color; ctx.shadowBlur = 14;

  if (st.form === 'orb') {
    for (let i = 0; i < 4; i++) drawRing3D(0.75 + i * 0.24, 0, t * (0.9 + i * 0.2), i * 0.65, 36, cx, cy, scale, 0.85);
    const core = project(0, 0, 0, cx, cy, scale);
    ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.arc(core.x, core.y, core.s * (0.28 + Math.sin(t * 4) * 0.04), 0, Math.PI * 2); ctx.fill();
  } else if (st.form === 'lantern') {
    const bob = Math.sin(t * 2) * 0.12, top = [0, 1.15 + bob, 0], bot = [0, -1.05 + bob, 0], r = 0.65, ringPts = [];
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + t * 0.5; ringPts.push([Math.cos(a) * r, 0.1 + bob, Math.sin(a) * r]); }
    for (let k = 0; k < 6; k++) { drawLine3D(top, ringPts[k], cx, cy, scale, 0.9, 2); drawLine3D(bot, ringPts[k], cx, cy, scale, 0.9, 2); drawLine3D(ringPts[k], ringPts[(k + 1) % 6], cx, cy, scale, 0.9, 2); }
    const flame = project(0, 0.1 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(flame.x, flame.y, flame.s * (0.22 + Math.sin(t * 6) * 0.05), 0, Math.PI * 2); ctx.fill();
  } else if (st.form === 'fox') {
    const stride = Math.sin(t * 6), fx = Math.cos(t * 1.1) * 0.9, fy = Math.sin(t * 6) * 0.14, fz = Math.sin(t * 1.1) * 0.6;
    const nose = [fx + 0.95, fy + 0.18 + stride * 0.08, fz], earL = [fx + 0.55, fy + 0.55, fz - 0.16], earR = [fx + 0.55, fy + 0.55, fz + 0.16];
    const neck = [fx + 0.42, fy + 0.15, fz], hip = [fx - 0.55, fy + 0.08 - stride * 0.06, fz], chest = [fx + 0.25, fy - 0.22, fz];
    drawLine3D(nose, earL, cx, cy, scale, 0.95, 2.2); drawLine3D(nose, earR, cx, cy, scale, 0.95, 2.2);
    drawLine3D(earL, neck, cx, cy, scale, 0.9, 2); drawLine3D(earR, neck, cx, cy, scale, 0.9, 2);
    drawLine3D(nose, chest, cx, cy, scale, 0.9, 2); drawLine3D(neck, hip, cx, cy, scale, 0.95, 2.5); drawLine3D(chest, hip, cx, cy, scale, 0.85, 1.8);
    for (let k = -3; k <= 3; k++) {
      const mid = [fx - 1.05, fy + 0.28 + Math.abs(k) * 0.08 + Math.sin(t * 6 + k) * 0.14, fz + k * 0.22];
      const tip = [fx - 1.65, fy + 0.18 + Math.abs(k) * 0.14 + Math.cos(t * 6 + k) * 0.2, fz + k * 0.36];
      drawLine3D(hip, mid, cx, cy, scale, 0.8, 1.8); drawLine3D(mid, tip, cx, cy, scale, 0.65, 1.4);
    }
  } else {
    const bob = Math.sin(t * 1.8) * 0.08;
    const headPos = project(0, 1.05 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 0.92; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(headPos.x, headPos.y, headPos.s * 0.26, 0, Math.PI * 2); ctx.stroke();
    const shoulders = [0, 0.72 + bob, 0], basePts = [];
    for (let s = 0; s < 8; s++) { const a = (s / 8) * Math.PI * 2; basePts.push([Math.cos(a) * 0.65, -0.95 + bob, Math.sin(a) * 0.65]); }
    for (let s = 0; s < 8; s++) { drawLine3D(shoulders, basePts[s], cx, cy, scale, 0.78, 1.8); drawLine3D(basePts[s], basePts[(s + 1) % 8], cx, cy, scale, 0.78, 1.8); }
    const heart = project(0, 0.22 + bob, 0, cx, cy, scale);
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(heart.x, heart.y, heart.s * (0.14 + Math.sin(t * 4) * 0.03), 0, Math.PI * 2); ctx.fill();

    // 8 Archetype Rigs
    if (st.persona === 'oracle') {
      for (let r = 0; r < 12; r++) { const a = (r / 12) * Math.PI * 2 + t * 0.35; drawLine3D([Math.cos(a) * 0.36, 1.05 + bob + Math.sin(a) * 0.36, -0.1], [Math.cos(a) * 0.72, 1.05 + bob + Math.sin(a) * 0.72, -0.1], cx, cy, scale, 0.9, 2); }
    } else if (st.persona === 'detective') {
      drawRing3D(0.55, 1.24 + bob, 0.12, -0.12, 28, cx, cy, scale, 0.95);
      drawRing3D(0.22, 0.35 + bob, 0.3, 0.2, 20, cx + scale * 0.55, cy, scale, 0.9);
    } else if (st.persona === 'engineer') {
      drawRing3D(0.68, 1.05 + bob, 0.35, Math.sin(t) * 0.3, 30, cx, cy, scale, 0.9);
      drawRing3D(0.88, 1.05 + bob, -0.35, Math.cos(t) * 0.3, 30, cx, cy, scale, 0.75);
    } else if (st.persona === 'apothecary') {
      for (let i = 0; i < 10; i++) {
        const y = -0.7 + i * 0.18 + bob, a = t * 1.4 + i * 0.65;
        const pA = [Math.cos(a) * 0.85, y, Math.sin(a) * 0.85], pB = [Math.cos(a + Math.PI) * 0.85, y, Math.sin(a + Math.PI) * 0.85];
        drawLine3D(pA, pB, cx, cy, scale, 0.85, 1.6);
      }
    } else if (st.persona === 'advocate') {
      const tilt = Math.sin(t * 1.5) * 0.12;
      drawLine3D([-0.95, 0.75 + bob + tilt, 0], [0.95, 0.75 + bob - tilt, 0], cx, cy, scale, 0.95, 2.2);
      drawRing3D(0.26, 0.42 + bob + tilt, 0, 0, 20, cx - scale * 0.42, cy, scale, 0.85);
      drawRing3D(0.26, 0.42 + bob - tilt, 0, 0, 20, cx + scale * 0.42, cy, scale, 0.85);
    } else if (st.persona === 'architect') {
      drawRing3D(0.95, 0.2 + bob, t * 0.5, t * 0.3, 5, cx, cy, scale, 0.9);
      drawRing3D(0.62, 0.2 + bob, -t * 0.5, -t * 0.3, 5, cx, cy, scale, 0.8);
    } else if (st.persona === 'strategist') {
      for (let g = -2; g <= 2; g++) {
        drawLine3D([g * 0.4, -0.95 + bob, -0.8], [g * 0.4, -0.95 + bob, 0.8], cx, cy, scale, 0.6, 1.3);
        drawLine3D([-0.8, -0.95 + bob, g * 0.4], [0.8, -0.95 + bob, g * 0.4], cx, cy, scale, 0.6, 1.3);
      }
    } else if (st.persona === 'pedagogue') {
      drawRing3D(0.75, 0.3 + bob, 0.2, 0, 32, cx, cy, scale, 0.85);
      drawRing3D(1.05, 0.3 + bob, -0.2, 0, 32, cx, cy, scale, 0.65);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(render);
}
render();
