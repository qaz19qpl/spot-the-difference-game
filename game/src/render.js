// Drawing: paints both panels from the current game state, plus the markers,
// the hint pulse, the floating score popups and the keyboard crosshair.
// Panel A is always the original; panel B is the original plus every
// difference's paintB. Found differences get a green ring on both panels.
export class Renderer {
  constructor(canvasA, canvasB) {
    this.a = canvasA;
    this.b = canvasB;
    this.ctxA = canvasA.getContext('2d');
    this.ctxB = canvasB.getContext('2d');
    // The scene itself is painted once per level onto offscreen canvases;
    // every frame only blits them and draws the moving parts on top.
    this.offA = document.createElement('canvas');
    this.offB = document.createElement('canvas');
    this.offA.width = this.offB.width = 560;
    this.offA.height = this.offB.height = 560;
  }

  drawScene(scene) {
    const ca = this.offA.getContext('2d');
    const cb = this.offB.getContext('2d');
    ca.clearRect(0, 0, 560, 560);
    cb.clearRect(0, 0, 560, 560);
    scene.paint(ca);
    scene.paint(cb);
    for (const diff of scene.differences) diff.paintB(cb);
  }

  // Copy the painted scene onto the visible panels.
  blit() {
    this.ctxA.drawImage(this.offA, 0, 0);
    this.ctxB.drawImage(this.offB, 0, 0);
  }

  // A found difference: a green ring with a check, popping in over 250 ms.
  drawFoundMarker(ctx, diff, ageMs) {
    const pop = Math.min(1, ageMs / 250);
    const r = diff.r * (0.7 + 0.3 * pop);
    ctx.save();
    ctx.globalAlpha = Math.min(1, ageMs / 120);
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const s = r * 0.45;
    ctx.beginPath();
    ctx.moveTo(diff.x - s, diff.y);
    ctx.lineTo(diff.x - s * 0.25, diff.y + s * 0.6);
    ctx.lineTo(diff.x + s, diff.y - s * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  // A wrong click: a red X that fades out over 500 ms.
  drawMissMark(ctx, x, y, ageMs) {
    const alpha = Math.max(0, 1 - ageMs / 500);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ff5a4e';
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s);
    ctx.stroke();
    ctx.restore();
  }

  // A hint: a pulsing gold ring around a difference still unfound.
  drawHintRing(ctx, diff, nowMs) {
    const pulse = 0.5 + 0.5 * Math.sin(nowMs / 180);
    ctx.save();
    ctx.strokeStyle = `rgba(255, 217, 122, ${0.55 + 0.45 * pulse})`;
    ctx.lineWidth = 3 + pulse * 2;
    ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 4 + pulse * 4, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // The keyboard crosshair: a small reticle on the active panel.
  drawCrosshair(ctx, x, y, active) {
    ctx.save();
    ctx.strokeStyle = active ? '#ffd97a' : 'rgba(255, 217, 122, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y); ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y); ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 18);
    ctx.stroke();
    ctx.restore();
  }

  // Floating "+100" text that rises and fades.
  drawFloatText(ctx, text, x, y, ageMs, color = '#ffd97a') {
    const alpha = Math.max(0, 1 - ageMs / 900);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = 'bold 20px "Avenir Next", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 4;
    ctx.fillText(text, x, y - ageMs / 25);
    ctx.restore();
  }
}
