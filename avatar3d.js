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
  const a = project(p1, p1, p1, cx, cy, scale);
  const b = project(p2, p2, p2, cx, cy, scale);
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

const particles = Array.from({ length: 220 }, () => ({
  x: (Math.random() - 0.5) * 4.5, y: (Math.random() - 0.5) * 4.5, z: (Math.random() - 0.5) * 4.5, phase: Math.random() * Math.PI * 2
}));

const PALETTES = {
  base: '#38bdf8', detective: '#f59e0b', engineer: '#22d3ee', oracle: '#fde047',
  apothecary: '#10b981', advocate: '#a78bfa', architect: '#f43f5e', strategist: '#2dd4bf',
  pedagogue: '#60a5fa', scholar: '#fbbf24'
};
const savedKey = localStorage.getItem('LUMEN_GEMINI_KEY');
if (savedKey) document.getElementById('api-key-input').value = savedKey;
loadPersonaCanon('base');
saveBookState();
updateVitalsUI();
