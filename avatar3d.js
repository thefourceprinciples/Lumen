const container = document.getElementById('avatar-stage');
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.cursor = 'grab';
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

let rotY = 0, rotX = 0.16, zoom = 1.0, isDragging = false, lastMouse = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => { isDragging = true; canvas.style.cursor = 'grabbing'; lastMouse = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mouseup', () => { isDragging = false; canvas.style.cursor = 'grab'; });
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  rotY += (e.clientX - lastMouse.x) * 0.01;
  rotX = Math.max(-0.85, Math.min(0.85, rotX + (e.clientY - lastMouse.y) * 0.01));
  lastMouse = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.max(0.55, Math.min(1.85, zoom - e.deltaY * 0.0008)); }, { passive: false });

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

function drawLine3D(p1, p2, cx, cy, scale, alpha = 0.85, width = 1.4) {
  const a = project(p1.at(0), p1.at(1), p1.at(2), cx, cy, scale);
  const b = project(p2.at(0), p2.at(1), p2.at(2), cx, cy, scale);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawNode3D(pt, cx, cy, scale, radius = 0.025, alpha = 0.95) {
  const p = project(pt.at(0), pt.at(1), pt.at(2), cx, cy, scale);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(1.4, p.s * radius), 0, Math.PI * 2);
  ctx.fill();
}

function drawRing3D(radius, yOffset, tiltX, tiltZ, segments, cx, cy, scale, alpha = 0.8, width = 1.4) {
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
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

function drawPolyRing3D(radius, yOffset, sides, rotOffset, cx, cy, scale, alpha = 0.8, width = 1.4) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + rotOffset;
    pts.push([Math.cos(a) * radius, yOffset, Math.sin(a) * radius]);
  }
  for (let i = 0; i < sides; i++) drawLine3D(pts.at(i), pts.at((i + 1) % sides), cx, cy, scale, alpha, width);
  return pts;
}

function rot3D(pt, yaw, ox, oy, oz) {
  const cos = Math.cos(yaw), sin = Math.sin(yaw);
  const px = pt.at(0), py = pt.at(1), pz = pt.at(2);
  return [ox + px * cos - pz * sin, oy + py, oz + px * sin + pz * cos];
}

function drawHUDFrame(w, h, color, t, st) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.shadowBlur = 0;

  const pad = 16, len = 26;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.5;
  const corners = [
    [pad, pad, 1, 1], [w - pad, pad, -1, 1],
    [pad, h - pad, 1, -1], [w - pad, h - pad, -1, -1]
  ];
  corners.forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * len, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * len);
    ctx.moveTo(x + dx * (len - 8), y + dy * 5); ctx.lineTo(x + dx * 5, y + dy * 5); ctx.lineTo(x + dx * 5, y + dy * (len - 8));
    ctx.stroke();
  });

  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 1;
  for (let x = pad + 40; x < w - pad - 40; x += 14) {
    const tickH = (x % 56 === 0) ? 7 : 3;
    ctx.beginPath();
    ctx.moveTo(x, pad); ctx.lineTo(x, pad + tickH);
    ctx.moveTo(x, h - pad); ctx.lineTo(x, h - pad - tickH);
    ctx.stroke();
  }

  const rOuter = Math.min(w, h) * 0.43;
  ctx.globalAlpha = 0.16;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.5, rOuter, 0, Math.PI * 2);
  ctx.stroke();

  for (let d = 0; d < 36; d++) {
    const a = (d / 36) * Math.PI * 2 + t * 0.08;
    const r1 = rOuter - (d % 3 === 0 ? 8 : 4);
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + Math.cos(a) * r1, h * 0.5 + Math.sin(a) * r1);
    ctx.lineTo(w * 0.5 + Math.cos(a) * rOuter, h * 0.5 + Math.sin(a) * rOuter);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.5;
  ctx.font = '10px ui-monospace, monospace';
  ctx.fillText('AZM ' + ((rotY * 57.3) % 360).toFixed(1) + '° // ELV ' + (rotX * 57.3).toFixed(1) + '°', pad + 12, h - pad - 10);
  ctx.fillText('RIG // ' + st.persona.toUpperCase() + '.' + st.form.toUpperCase(), w - pad - 145, h - pad - 10);
  ctx.restore();
}
function draw3DChimericRunningFox(cx, cy, scale, t, accentColor) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = false;
  ctx.shadowBlur = 0;

  const px = Math.max(3, Math.round((scale * zoom) / 36));
  const orbit = t * 1.1;
  const fx = Math.cos(orbit) * 0.95;
  const fz = Math.sin(orbit) * 0.80;
  const gallop = Math.sin(t * 8.5);
  const fy = Math.abs(gallop) * 0.14 - 0.10;
  const yaw = -orbit - Math.PI / 2;

  const P = (x, y, z) => rot3D([x, y, z], yaw, fx, fy, fz);
  const voxels = [];

  const addCluster = (pt3D, radius, fill, border = '#090d16') => {
    const pr = project(pt3D.at(0), pt3D.at(1), pt3D.at(2), cx, cy, scale);
    if (pr.z < -3.4) return;
    const size = Math.max(px * 1.4, Math.round((pr.s * radius) / px) * px);
    voxels.push({ x: Math.round(pr.x / px) * px, y: Math.round(pr.y / px) * px, z: pr.z, size, fill, border });
  };

  const addTube = (pA, pB, steps, rStart, rEnd, cMain, cTip, border = '#090d16') => {
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const pt = [
        pA.at(0) + (pB.at(0) - pA.at(0)) * f,
        pA.at(1) + (pB.at(1) - pA.at(1)) * f,
        pA.at(2) + (pB.at(2) - pA.at(2)) * f
      ];
      const r = rStart + (rEnd - rStart) * f;
      addCluster(pt, r, f > 0.72 ? cTip : cMain, border);
    }
  };

  // 1. 9 Lush, Tapered 3D Tails (4 Russet/White Fur + 5 Ivory/Gold Biomechanical)
  for (let k = -4; k <= 4; k++) {
    const isMech = k > 0;
    const spreadZ = k * 0.16;
    const liftY = 0.22 + Math.abs(k) * 0.06;
    const wave = Math.sin(t * 6.5 + k * 0.75) * 0.10;
    const wave2 = Math.cos(t * 6.5 + k * 0.75) * 0.14;

    const p0 = P(-0.46, 0.10, spreadZ * 0.2);
    const p1 = P(-0.78, liftY + wave, spreadZ * 0.65);
    const p2 = P(-1.12, liftY + 0.22 + wave2, spreadZ * 1.05);
    const tip = P(-1.36, liftY + 0.34 - wave, spreadZ * 1.15);

    const cBase = isMech ? '#f8fafc' : '#ea580c';
    const cMid  = isMech ? '#fbbf24' : '#c2410c';
    const cTip  = isMech ? '#f8fafc' : '#ffffff';

    addTube(p0, p1, 4, 0.09, 0.15, cBase, cBase);
    addTube(p1, p2, 5, 0.15, 0.13, cMid, cBase);
    addTube(p2, tip, 4, 0.12, 0.04, cBase, cTip);
  }

  // 2. Muscular Galloping Legs (Russet Thighs + Dark Charcoal Stockings & Paws)
  const sF = Math.sin(t * 8.5) * 0.32;
  const sB = Math.cos(t * 8.5) * 0.32;
  const legs = [
    { hip: P(0.30, -0.02, -0.17), knee: P(0.34 + sF * 0.7, -0.34 + Math.max(0, sF) * 0.2, -0.18), paw: P(0.36 + sF, -0.66 + Math.max(0, sF) * 0.3, -0.17) },
    { hip: P(0.30, -0.02, 0.17),  knee: P(0.34 - sF * 0.7, -0.34 + Math.max(0, -sF) * 0.2, 0.18), paw: P(0.36 - sF, -0.66 + Math.max(0, -sF) * 0.3, 0.17) },
    { hip: P(-0.42, 0.00, -0.16), knee: P(-0.48 + sB * 0.7, -0.34 + Math.max(0, sB) * 0.2, -0.17), paw: P(-0.46 + sB, -0.66 + Math.max(0, sB) * 0.3, -0.16) },
    { hip: P(-0.42, 0.00, 0.16),  knee: P(-0.48 - sB * 0.7, -0.34 + Math.max(0, -sB) * 0.2, 0.17), paw: P(-0.46 - sB, -0.66 + Math.max(0, -sB) * 0.3, 0.16) }
  ];
  legs.forEach(l => {
    addTube(l.hip, l.knee, 4, 0.11, 0.07, '#ea580c', '#9a3412');
    addTube(l.knee, l.paw, 4, 0.065, 0.055, '#1e1b24', '#090d16');
    addCluster(l.paw, 0.075, '#1e1b24');
  });

  // 3. Ivory & Gold Armored Torso + Plush White Chest Ruff
  addTube(P(0.36, 0.14, 0), P(-0.44, 0.10, 0), 7, 0.23, 0.20, '#f8fafc', '#e2e8f0', '#fbbf24');
  [-0.20, 0.20].forEach(zSide => {
    addCluster(P(0.28, 0.08, zSide), 0.15, '#f8fafc', '#fbbf24');
    addCluster(P(-0.36, 0.08, zSide), 0.14, '#f8fafc', '#fbbf24');
  });
  addCluster(P(0.46, 0.12, 0), 0.21, '#ffffff', '#cbd5e1');
  addCluster(P(0.44, -0.02, -0.09), 0.15, '#f8fafc', '#cbd5e1');
  addCluster(P(0.44, -0.02, 0.09), 0.15, '#f8fafc', '#cbd5e1');

  // 4. Sculpted Chimeric 3D Head (Left Russet vs. Right Obsidian Volcanic Crest)
  const headY = 0.32 + gallop * 0.03;
  addCluster(P(0.56, headY, -0.08), 0.17, '#ea580c');
  addCluster(P(0.56, headY, 0.08), 0.18, '#1e1b24', '#3f3b4d');
  addCluster(P(0.52, headY + 0.08, 0.11), 0.14, '#272330', '#3f3b4d');
  addCluster(P(0.62, headY - 0.07, -0.10), 0.13, '#ffffff');
  addCluster(P(0.62, headY - 0.07, 0.09), 0.12, '#1e1b24');
  addTube(P(0.66, headY - 0.04, 0), P(0.88, headY - 0.06, 0), 3, 0.11, 0.06, '#ea580c', '#ffffff');
  addCluster(P(0.90, headY - 0.05, 0), 0.05, '#090d16');

  addTube(P(0.50, headY + 0.12, -0.12), P(0.46, headY + 0.38, -0.15), 4, 0.09, 0.03, '#ea580c', '#090d16');
  addTube(P(0.50, headY + 0.12, 0.12), P(0.44, headY + 0.34, 0.15), 3, 0.10, 0.05, '#1e1b24', '#3f3b4d');

  addCluster(P(0.71, headY + 0.02, -0.11), 0.042, '#fbbf24', '#090d16');
  addCluster(P(0.71, headY + 0.02, 0.11), 0.045, '#ef4444', '#090d16');

  // 5. Depth-Sort All Voxels Back-to-Front & Render Crisp Pixel Blocks
  voxels.sort((a, b) => b.z - a.z);
  for (let i = 0; i < voxels.length; i++) {
    const v = voxels.at(i);
    const half = v.size * 0.5;
    if (v.border) {
      ctx.fillStyle = v.border;
      ctx.fillRect(v.x - half - px * 0.5, v.y - half - px * 0.5, v.size + px, v.size + px);
    }
    ctx.fillStyle = v.fill;
    ctx.fillRect(v.x - half, v.y - half, v.size, v.size);
  }

  // 6. Golden Stardust Trail
  for (let p = 0; p < 16; p++) {
    const trailAngle = orbit - 0.25 - p * 0.08;
    const sp = project(Math.cos(trailAngle) * 1.05, fy + Math.sin(t * 4 + p) * 0.22, Math.sin(trailAngle) * 0.85, cx, cy, scale);
    ctx.globalAlpha = Math.max(0.15, 0.85 - p * 0.05);
    ctx.fillStyle = p % 3 === 0 ? accentColor : '#fbbf24';
    ctx.fillRect(Math.round(sp.x), Math.round(sp.y), px * 1.2, px * 1.2);
  }
  ctx.restore();
}
const particles = Array.from({ length: 240 }, () => ({
  x: (Math.random() - 0.5) * 4.8, y: (Math.random() - 0.5) * 4.8, z: (Math.random() - 0.5) * 4.8, phase: Math.random() * Math.PI * 2
}));

const PALETTES = {
  base: '#38bdf8', detective: '#f59e0b', engineer: '#22d3ee', oracle: '#fde047',
  apothecary: '#10b981', advocate: '#a78bfa', architect: '#f43f5e', strategist: '#2dd4bf',
  pedagogue: '#60a5fa', scholar: '#fbbf24'
};

let t = 0;
function render() {
  t += 0.025;
  if (!isDragging) rotY += 0.005;
  const w = canvas.width, h = canvas.height;
  if (!w || !h) { resize(); requestAnimationFrame(render); return; }

  const st = window.LUMEN_STATE || { persona: 'base', form: 'character', layout: 'docked' };
  const color = PALETTES[st.persona] || '#38bdf8';

  ctx.clearRect(0, 0, w, h);
  drawHUDFrame(w, h, color, t, st);

  ctx.strokeStyle = color; ctx.fillStyle = color;
  const cx = st.layout === 'roam' ? w * 0.5 + Math.cos(t * 0.45) * (w * 0.15) : w * 0.5;
  const cy = st.layout === 'roam' ? h * 0.5 + Math.sin(t * 0.65) * (h * 0.12) : h * 0.52;
  const scale = Math.min(w, h) * 0.24;

  ctx.shadowBlur = 0;
  const cosT = Math.cos(t * 0.15), sinT = Math.sin(t * 0.15);
  for (let i = 0; i < particles.length; i++) {
    const pt = particles.at(i);
    const proj = project(pt.x * cosT - pt.z * sinT, pt.y + Math.sin(t + pt.phase) * 0.08, pt.z * cosT + pt.x * sinT, cx, cy, scale);
    if (proj.z > -3.5) {
      ctx.globalAlpha = Math.max(0.1, 0.5 - proj.z * 0.1);
      const size = Math.max(1.2, proj.s * 0.015);
      ctx.fillRect(proj.x, proj.y, size, size);
    }
  }

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = color; ctx.shadowBlur = 12;

  drawRing3D(1.15, -1.18, 0, 0, 48, cx, cy, scale, 0.25, 1);
  drawRing3D(0.85, -1.18, 0, 0, 36, cx, cy, scale, 0.35, 1);

  if (st.form === 'orb') {
    for (let i = 0; i < 5; i++) drawRing3D(0.65 + i * 0.22, 0, t * (0.7 + i * 0.18), i * 0.55, 44, cx, cy, scale, 0.85, 1.4);
    const eq = drawPolyRing3D(0.55, 0, 8, t, cx, cy, scale, 0.9, 1.4);
    eq.forEach(p => { drawLine3D([0, 0.55, 0], p, cx, cy, scale, 0.75, 1.2); drawLine3D([0, -0.55, 0], p, cx, cy, scale, 0.75, 1.2); drawNode3D(p, cx, cy, scale, 0.022); });
    drawNode3D([0, 0, 0], cx, cy, scale, 0.18 + Math.sin(t * 4) * 0.03, 0.95);

  } else if (st.form === 'lantern') {
    const bob = Math.sin(t * 2) * 0.1, top = [0, 1.22 + bob, 0], bot = [0, -1.08 + bob, 0];
    const upper = drawPolyRing3D(0.58, 0.45 + bob, 8, t * 0.4, cx, cy, scale, 0.9, 1.5);
    const lower = drawPolyRing3D(0.48, -0.35 + bob, 8, -t * 0.4, cx, cy, scale, 0.9, 1.5);
    for (let k = 0; k < 8; k++) {
      drawLine3D(top, upper.at(k), cx, cy, scale, 0.85, 1.4);
      drawLine3D(upper.at(k), lower.at(k), cx, cy, scale, 0.85, 1.4);
      drawLine3D(upper.at(k), lower.at((k + 1) % 8), cx, cy, scale, 0.45, 1);
      drawLine3D(lower.at(k), bot, cx, cy, scale, 0.85, 1.4);
      drawNode3D(upper.at(k), cx, cy, scale, 0.02);
    }
    drawRing3D(0.32, 0.05 + bob, t * 1.2, 0.4, 24, cx, cy, scale, 0.8, 1.2);
    drawNode3D([0, 0.05 + bob, 0], cx, cy, scale, 0.16 + Math.sin(t * 6) * 0.04, 1);

  } else if (st.form === 'fox') {
    draw3DChimericRunningFox(cx, cy, scale, t, color);

  } else {
    const bob = Math.sin(t * 1.8) * 0.07;
    const crown = [0, 1.34 + bob, 0], chin = [0, 0.84 + bob, 0];
    const headRing = drawPolyRing3D(0.24, 1.09 + bob, 8, t * 0.3, cx, cy, scale, 0.9, 1.5);
    headRing.forEach(p => { drawLine3D(crown, p, cx, cy, scale, 0.8, 1.3); drawLine3D(chin, p, cx, cy, scale, 0.8, 1.3); });

    const neckBase = [0, 0.76 + bob, 0], heart = [0, 0.34 + bob, 0];
    const shL = [-0.46, 0.64 + bob, 0], shR = [0.46, 0.64 + bob, 0];
    const chestRing = drawPolyRing3D(0.36, 0.42 + bob, 6, 0, cx, cy, scale, 0.85, 1.4);
    const waistRing = drawPolyRing3D(0.26, -0.05 + bob, 6, Math.PI / 6, cx, cy, scale, 0.85, 1.4);
    const hemRing = drawPolyRing3D(0.72, -1.02 + bob, 12, 0, cx, cy, scale, 0.8, 1.5);

    drawLine3D(chin, neckBase, cx, cy, scale, 0.9, 1.8);
    drawLine3D(neckBase, shL, cx, cy, scale, 0.95, 2); drawLine3D(neckBase, shR, cx, cy, scale, 0.95, 2);
    drawNode3D(shL, cx, cy, scale, 0.032); drawNode3D(shR, cx, cy, scale, 0.032);
    chestRing.forEach((p, idx) => {
      drawLine3D(neckBase, p, cx, cy, scale, 0.7, 1.2);
      drawLine3D(p, waistRing.at(idx), cx, cy, scale, 0.8, 1.4);
      drawLine3D(p, waistRing.at((idx + 1) % 6), cx, cy, scale, 0.5, 1);
    });
    for (let s = 0; s < 12; s++) {
      const wPt = waistRing.at(Math.floor(s / 2));
      drawLine3D(wPt, hemRing.at(s), cx, cy, scale, 0.72, 1.4);
      drawLine3D(hemRing.at(s), hemRing.at((s + 1) % 12), cx, cy, scale, 0.82, 1.5);
    }
    drawNode3D(heart, cx, cy, scale, 0.13 + Math.sin(t * 4) * 0.025, 1);

    if (st.persona === 'oracle') {
      for (let r = 0; r < 16; r++) { const a = (r / 16) * Math.PI * 2 + t * 0.35; const len = r % 2 === 0 ? 0.78 : 0.58; drawLine3D([Math.cos(a) * 0.34, 1.09 + bob + Math.sin(a) * 0.34, -0.1], [Math.cos(a) * len, 1.09 + bob + Math.sin(a) * len, -0.1], cx, cy, scale, 0.9, 1.7); }
    } else if (st.persona === 'detective') {
      drawRing3D(0.56, 1.26 + bob, 0.12, -0.12, 32, cx, cy, scale, 0.95, 1.6);
      drawRing3D(0.24, 0.38 + bob, 0.3, 0.2, 24, cx + scale * 0.55, cy, scale, 0.9, 1.6);
    } else if (st.persona === 'engineer') {
      drawRing3D(0.72, 1.09 + bob, 0.35, Math.sin(t) * 0.3, 36, cx, cy, scale, 0.9, 1.5);
      drawRing3D(0.92, 1.09 + bob, -0.35, Math.cos(t) * 0.3, 36, cx, cy, scale, 0.75, 1.4);
    } else if (st.persona === 'apothecary') {
      for (let i = 0; i < 12; i++) {
        const y = -0.75 + i * 0.17 + bob, a = t * 1.4 + i * 0.6;
        const pA = [Math.cos(a) * 0.88, y, Math.sin(a) * 0.88], pB = [Math.cos(a + Math.PI) * 0.88, y, Math.sin(a + Math.PI) * 0.88];
        drawLine3D(pA, pB, cx, cy, scale, 0.85, 1.5); drawNode3D(pA, cx, cy, scale, 0.02); drawNode3D(pB, cx, cy, scale, 0.02);
      }
    } else if (st.persona === 'advocate') {
      const tilt = Math.sin(t * 1.5) * 0.12;
      drawLine3D([-0.98, 0.78 + bob + tilt, 0], [0.98, 0.78 + bob - tilt, 0], cx, cy, scale, 0.95, 2);
      drawRing3D(0.28, 0.44 + bob + tilt, 0, 0, 24, cx - scale * 0.43, cy, scale, 0.85, 1.5);
      drawRing3D(0.28, 0.44 + bob - tilt, 0, 0, 24, cx + scale * 0.43, cy, scale, 0.85, 1.5);
    } else if (st.persona === 'architect') {
      drawPolyRing3D(0.95, 0.22 + bob, 5, t * 0.5, cx, cy, scale, 0.9, 1.6);
      drawPolyRing3D(0.62, 0.22 + bob, 5, -t * 0.5, cx, cy, scale, 0.8, 1.4);
    } else if (st.persona === 'strategist') {
      for (let g = -3; g <= 3; g++) {
        drawLine3D([g * 0.35, -1.02 + bob, -1.05], [g * 0.35, -1.02 + bob, 1.05], cx, cy, scale, 0.6, 1.2);
        drawLine3D([-1.05, -1.02 + bob, g * 0.35], [1.05, -1.02 + bob, g * 0.35], cx, cy, scale, 0.6, 1.2);
      }
    } else if (st.persona === 'pedagogue') {
      drawRing3D(0.78, 0.32 + bob, 0.22, 0, 36, cx, cy, scale, 0.85, 1.5);
      drawRing3D(1.08, 0.32 + bob, -0.22, 0, 36, cx, cy, scale, 0.65, 1.3);
    } else if (st.persona === 'scholar') {
      drawRing3D(0.98, 0.48 + bob, t * 0.4, 0.35, 40, cx, cy, scale, 0.9, 1.5);
      drawRing3D(1.18, 0.48 + bob, -t * 0.3, -0.35, 40, cx, cy, scale, 0.75, 1.3);
      drawLine3D([-0.58, 0.26 + bob, 0.48], [-0.08, 0.2 + bob, 0.58], cx, cy, scale, 0.9, 1.8);
      drawLine3D([0.08, 0.2 + bob, 0.58], [0.58, 0.26 + bob, 0.48], cx, cy, scale, 0.9, 1.8);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(render);
}
render();
