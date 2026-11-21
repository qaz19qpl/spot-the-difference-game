// Small shared painters used by more than one scene: paper lanterns, stars,
// birds, string lights and rooftops. Every helper draws with plain canvas 2D
// shapes, so the whole game ships with no image files at all.
export function paperLantern(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  // Warm halo behind the paper.
  const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.1);
  glow.addColorStop(0, 'rgba(255, 190, 90, 0.5)');
  glow.addColorStop(1, 'rgba(255, 190, 90, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2); ctx.fill();
  // Ribbed paper body.
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(120, 30, 20, 0.55)';
  ctx.lineWidth = 1.2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, r * (1 - Math.abs(i) * 0.14), r * 1.15, 0, -Math.PI / 2.4, Math.PI / 2.4);
    ctx.stroke();
  }
  // Caps and tassel.
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(-r * 0.35, -r * 1.3, r * 0.7, r * 0.22);
  ctx.fillRect(-r * 0.35, r * 1.08, r * 0.7, r * 0.22);
  ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(0, r * 1.3); ctx.lineTo(0, r * 1.75); ctx.stroke();
  ctx.restore();
}

export function fourPointStar(ctx, x, y, r, color = '#fff6c9') {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
  ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
  ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
  ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
  ctx.fill();
  ctx.restore();
}

export function perchedBird(ctx, x, y, scale = 1, color = '#2a2138') {
  ctx.save();
  ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, 0, 9, 6.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -6, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -6); ctx.lineTo(15, -4.5); ctx.lineTo(10, -3.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-8, 2); ctx.lineTo(-14, 7); ctx.lineTo(-7, 5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-2, 6); ctx.lineTo(-2, 10); ctx.moveTo(3, 6); ctx.lineTo(3, 10); ctx.stroke();
  ctx.restore();
}

// A sagging wire with glowing bulbs, from (x0, y0) to (x1, y1).
export function stringLights(ctx, x0, y0, x1, y1, sag, bulbColors, rng) {
  ctx.save();
  ctx.strokeStyle = 'rgba(30, 20, 45, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1);
  ctx.stroke();
  const n = 9;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const bx = x0 + (x1 - x0) * t;
    const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (Math.max(y0, y1) + sag) + t * t * y1;
    const color = bulbColors[Math.floor(rng() * bulbColors.length)];
    const glow = ctx.createRadialGradient(bx, by + 7, 1, bx, by + 7, 12);
    glow.addColorStop(0, color); glow.addColorStop(1, 'rgba(255, 200, 90, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(bx, by + 7, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(bx, by + 7, 3.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// A row of dark rooftops with a few lit windows, for a distant skyline.
// `roofs` is an explicit list of {x, w, h} so a difference can sit on a known roof.
export function rooftops(ctx, yBase, roofs, litWindows) {
  ctx.save();
  roofs.forEach(({ x, w, h }) => {
    ctx.fillStyle = '#241a3d';
    ctx.beginPath();
    ctx.moveTo(x, yBase);
    ctx.lineTo(x, yBase - h);
    ctx.lineTo(x + w / 2, yBase - h - 22);
    ctx.lineTo(x + w, yBase - h);
    ctx.lineTo(x + w, yBase);
    ctx.closePath(); ctx.fill();
  });
  litWindows.forEach(([wx, wy, ww, wh]) => {
    ctx.fillStyle = '#ffd97a';
    ctx.fillRect(wx, wy, ww, wh);
  });
  ctx.restore();
}
