// Scene 3 — Tea House in the Snow. A mountain tea house in winter, with a
// frozen pond, stone lanterns and pines. 12 differences, 120 seconds.
import { paperLantern, fourPointStar, perchedBird } from './draw-helpers.js';
import { mulberry32 } from './prng.js';

const W = 560;
const H = 560;

function pine(ctx, x, y, s, snow = true) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(-4, 0, 8, 14);
  ctx.fillStyle = '#2e5d3a';
  [[0, -62, 34], [0, -38, 46], [0, -12, 58]].forEach(([cx, ty, w]) => {
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, ty + 26); ctx.lineTo(cx, ty); ctx.lineTo(cx + w / 2, ty + 26);
    ctx.closePath(); ctx.fill();
  });
  if (snow) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    [[0, -62, 34], [0, -38, 46], [0, -12, 58]].forEach(([cx, ty, w]) => {
      ctx.beginPath();
      ctx.moveTo(cx - w / 2 + 4, ty + 20); ctx.lineTo(cx, ty + 2); ctx.lineTo(cx + w / 2 - 4, ty + 20);
      ctx.lineTo(cx + w / 4, ty + 24); ctx.lineTo(cx, ty + 14); ctx.lineTo(cx - w / 4, ty + 24);
      ctx.closePath(); ctx.fill();
    });
  }
  ctx.restore();
}

function stoneLantern(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#8a8fa8';
  ctx.fillRect(-14, 0, 28, 6);
  ctx.fillRect(-10, -16, 20, 16);
  ctx.fillStyle = '#ffd97a';
  ctx.fillRect(-7, -13, 14, 10);
  ctx.fillStyle = '#6a6f88';
  ctx.fillRect(-16, -22, 32, 6);
  ctx.beginPath(); ctx.moveTo(-12, -22); ctx.lineTo(0, -34); ctx.lineTo(12, -22); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function paintWinterSky(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#33395e');
  sky.addColorStop(0.6, '#9aa8c0');
  sky.addColorStop(1, '#e8d9c0');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 280);
  const glow = ctx.createRadialGradient(480, 70, 8, 480, 70, 60);
  glow.addColorStop(0, 'rgba(240, 236, 220, 0.7)');
  glow.addColorStop(1, 'rgba(240, 236, 220, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(480, 70, 60, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f0ecdc';
  ctx.beginPath(); ctx.arc(480, 70, 24, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + rng() * 0.5})`;
    ctx.beginPath(); ctx.arc(rng() * W, rng() * 260, 1 + rng() * 1.6, 0, Math.PI * 2); ctx.fill();
  }
}

function paintMountains(ctx) {
  ctx.fillStyle = '#6a7a9c';
  ctx.beginPath();
  ctx.moveTo(0, 280); ctx.lineTo(90, 190); ctx.lineTo(170, 250); ctx.lineTo(250, 180);
  ctx.lineTo(340, 255); ctx.lineTo(430, 195); ctx.lineTo(520, 260); ctx.lineTo(560, 220);
  ctx.lineTo(560, 300); ctx.lineTo(0, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff';
  [[90, 190], [250, 180], [430, 195]].forEach(([px, py]) => {
    ctx.beginPath();
    ctx.moveTo(px - 26, py + 26); ctx.lineTo(px, py); ctx.lineTo(px + 26, py + 26);
    ctx.lineTo(px + 12, py + 18); ctx.lineTo(px, py + 26); ctx.lineTo(px - 12, py + 18);
    ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = '#4a5a7c';
  ctx.beginPath();
  ctx.moveTo(0, 300); ctx.lineTo(120, 250); ctx.lineTo(230, 292); ctx.lineTo(360, 246);
  ctx.lineTo(480, 296); ctx.lineTo(560, 258); ctx.lineTo(560, 310); ctx.lineTo(0, 310);
  ctx.closePath(); ctx.fill();
}

function paintSnowGround(ctx, rng) {
  const g = ctx.createLinearGradient(0, 300, 0, H);
  g.addColorStop(0, '#e8eef5');
  g.addColorStop(1, '#c2cfe0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 300, W, H - 300);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    ctx.ellipse(rng() * W, 310 + rng() * 240, 14 + rng() * 26, 5 + rng() * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintTeaHouse(ctx) {
  // Walls and snow-capped roof.
  ctx.fillStyle = '#7a4a26';
  ctx.fillRect(180, 280, 200, 150);
  ctx.fillStyle = '#5a3418';
  ctx.fillRect(180, 280, 200, 8);
  ctx.fillStyle = '#2a2138';
  ctx.beginPath();
  ctx.moveTo(160, 282); ctx.lineTo(400, 282); ctx.lineTo(382, 248); ctx.lineTo(178, 248);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(178, 250); ctx.lineTo(382, 250); ctx.lineTo(376, 240); ctx.lineTo(184, 240);
  ctx.closePath(); ctx.fill();
  // Paper sliding doors.
  [[225, 320], [295, 320]].forEach(([x, y]) => {
    ctx.fillStyle = '#e8d9b0';
    ctx.fillRect(x, y, 55, 110);
    ctx.strokeStyle = '#5a3418'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 55, 110);
    ctx.beginPath(); ctx.moveTo(x + 27, y); ctx.lineTo(x + 27, y + 110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + 55); ctx.lineTo(x + 55, y + 55); ctx.stroke();
  });
  // Left window glows warm; right window is dark at dusk.
  ctx.fillStyle = '#ffd97a';
  ctx.fillRect(186, 320, 26, 40);
  ctx.fillStyle = '#1a1430';
  ctx.fillRect(354, 320, 26, 40);
  ctx.strokeStyle = '#5a3418'; ctx.lineWidth = 2;
  ctx.strokeRect(186, 320, 26, 40);
  ctx.strokeRect(354, 320, 26, 40);
  // Hanging sign: the character for tea.
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(255, 282, 50, 22);
  ctx.fillStyle = '#ffd97a';
  ctx.font = 'bold 15px serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('茶', 280, 294);
  // Porch, kettle, and a red paper lantern on the eave.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(170, 430, 220, 12);
  ctx.fillStyle = '#2a2138';
  ctx.beginPath(); ctx.ellipse(360, 424, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(370, 420); ctx.lineTo(380, 412); ctx.lineTo(380, 418); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(360, 412); ctx.quadraticCurveTo(354, 400, 360, 392); ctx.stroke();
  paperLantern(ctx, 205, 308, 10, '#d94f3d');
}

function paintGarden(ctx) {
  pine(ctx, 90, 400, 1.1);
  pine(ctx, 452, 408, 0.85);
  stoneLantern(ctx, 150, 448, 1);
  stoneLantern(ctx, 408, 448, 0.9);
  // Frozen pond with cracks, bottom right.
  ctx.fillStyle = '#9cc4d8';
  ctx.beginPath(); ctx.ellipse(470, 512, 72, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(420, 500); ctx.lineTo(450, 512); ctx.lineTo(440, 528); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(500, 498); ctx.lineTo(480, 514); ctx.lineTo(505, 526); ctx.stroke();
}

export function paintTeaHouseScene(ctx) {
  const rng = mulberry32(20261123);
  paintWinterSky(ctx, rng);
  paintMountains(ctx);
  paintSnowGround(ctx, rng);
  paintTeaHouse(ctx);
  paintGarden(ctx);
}

export const teaHouseScene = {
  id: 'teahouse',
  name: 'Tea House in the Snow',
  subtitle: 'Twelve changes hide in the snow. The kettle is on.',
  timeLimit: 120,
  paint: paintTeaHouseScene,
  differences: [
    {
      x: 80, y: 285, r: 20, label: 'one more pine on the ridge',
      paintB(ctx) { pine(ctx, 80, 300, 0.6); },
    },
    {
      x: 367, y: 340, r: 18, label: 'the right window lights up',
      paintB(ctx) {
        const glow = ctx.createRadialGradient(367, 340, 2, 367, 340, 26);
        glow.addColorStop(0, 'rgba(255, 217, 122, 0.7)');
        glow.addColorStop(1, 'rgba(255, 217, 122, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(367, 340, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd97a';
        ctx.fillRect(354, 320, 26, 40);
      },
    },
    {
      x: 420, y: 430, r: 20, label: 'one more stone lantern by the porch',
      paintB(ctx) { stoneLantern(ctx, 420, 448, 0.85); },
    },
    {
      x: 280, y: 293, r: 20, label: 'the hanging sign changes its character',
      paintB(ctx) {
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(255, 282, 50, 22);
        ctx.fillStyle = '#ffd97a';
        ctx.font = 'bold 15px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('雪', 280, 294);
      },
    },
    {
      x: 374, y: 392, r: 16, label: 'a second curl of steam rises from the kettle',
      paintB(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(372, 410); ctx.quadraticCurveTo(378, 398, 372, 388); ctx.stroke();
      },
    },
    {
      x: 250, y: 244, r: 16, label: 'a bird perches on the roof',
      paintB(ctx) { perchedBird(ctx, 250, 244, 0.9); },
    },
    {
      x: 276, y: 505, r: 18, label: 'footprints appear in the snow',
      paintB(ctx) {
        ctx.fillStyle = 'rgba(90, 110, 140, 0.55)';
        [[268, 490], [284, 504], [270, 520]].forEach(([x, y]) => {
          ctx.beginPath(); ctx.ellipse(x, y, 5, 8, 0.15, 0, Math.PI * 2); ctx.fill();
        });
      },
    },
    {
      x: 330, y: 252, r: 18, label: 'a drift of snow piles on the roof',
      paintB(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.ellipse(330, 250, 26, 9, 0, 0, Math.PI * 2); ctx.fill();
      },
    },
    {
      x: 470, y: 512, r: 18, label: 'a koi swims under the ice',
      paintB(ctx) {
        ctx.fillStyle = 'rgba(232, 130, 63, 0.95)';
        ctx.beginPath(); ctx.ellipse(470, 512, 16, 7, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(484, 508); ctx.lineTo(492, 502); ctx.lineTo(492, 514); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2a2138';
        ctx.beginPath(); ctx.arc(459, 510, 1.6, 0, Math.PI * 2); ctx.fill();
      },
    },
    {
      x: 430, y: 55, r: 14, label: 'a bright star appears beside the moon',
      paintB(ctx) { fourPointStar(ctx, 430, 55, 8); },
    },
    {
      x: 130, y: 395, r: 18, label: 'a bamboo shoot grows by the house',
      paintB(ctx) {
        ctx.strokeStyle = '#4f8a4a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(130, 432); ctx.lineTo(130, 362); ctx.stroke();
        ctx.strokeStyle = '#6fae62'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(130, 400); ctx.lineTo(148, 388); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(130, 382); ctx.lineTo(114, 370); ctx.stroke();
      },
    },
    {
      x: 205, y: 308, r: 18, label: 'the porch lantern turns gold',
      paintB(ctx) { paperLantern(ctx, 205, 308, 10, '#e8a33d'); },
    },
  ],
};
