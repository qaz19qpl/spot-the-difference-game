// Scene 1 — Lantern Market at Dusk. Two stalls under string lights, a vendor,
// a cat, and the moon over the rooftops. 7 differences, 180 seconds.
import { paperLantern, fourPointStar, perchedBird, stringLights, rooftops } from './draw-helpers.js';
import { mulberry32 } from './prng.js';

const W = 560;
const H = 560;
const ROOFS = [
  { x: -10, w: 95, h: 70 }, { x: 79, w: 110, h: 95 }, { x: 183, w: 90, h: 60 },
  { x: 267, w: 120, h: 85 }, { x: 381, w: 100, h: 75 }, { x: 475, w: 90, h: 65 },
];

function paintSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 345);
  sky.addColorStop(0, '#171138');
  sky.addColorStop(0.55, '#5b2a55');
  sky.addColorStop(0.85, '#c65a35');
  sky.addColorStop(1, '#e8823f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 345);
}

function paintMoon(ctx) {
  const glow = ctx.createRadialGradient(462, 78, 10, 462, 78, 70);
  glow.addColorStop(0, 'rgba(247, 234, 208, 0.55)');
  glow.addColorStop(1, 'rgba(247, 234, 208, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(462, 78, 70, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath(); ctx.arc(462, 78, 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(200, 180, 140, 0.5)';
  ctx.beginPath(); ctx.arc(452, 70, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(472, 88, 4, 0, Math.PI * 2); ctx.fill();
}

function paintGround(ctx, rng) {
  const g = ctx.createLinearGradient(0, 345, 0, H);
  g.addColorStop(0, '#7a4a2c');
  g.addColorStop(1, '#3d2718');
  ctx.fillStyle = g;
  ctx.fillRect(0, 345, W, H - 345);
  // Cobbles and fallen petals, seeded so they never move.
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.08 + rng() * 0.12})`;
    ctx.beginPath();
    ctx.ellipse(rng() * W, 350 + rng() * 205, 7 + rng() * 8, 4 + rng() * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = `rgba(255, 150, 170, ${0.35 + rng() * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(rng() * W, 470 + rng() * 85, 3, 2, rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintLeftStall(ctx) {
  // Posts and striped awning.
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(45, 300, 8, 170);
  ctx.fillRect(222, 300, 8, 170);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#d94f3d' : '#f5ead2';
    ctx.fillRect(35 + i * 25, 292, 25, 34);
    ctx.beginPath();
    ctx.arc(35 + i * 25 + 12.5, 326, 12.5, 0, Math.PI);
    ctx.fill();
  }
  // Counter with jars.
  ctx.fillStyle = '#7a4a26';
  ctx.fillRect(40, 420, 195, 58);
  ctx.fillStyle = '#9c6234';
  ctx.fillRect(35, 410, 205, 12);
  const jars = [[72, 396, '#c96a3b'], [118, 392, '#7ba05b'], [163, 396, '#d9a441']];
  jars.forEach(([x, y, c]) => {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.ellipse(x, y, 14, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a2c17';
    ctx.fillRect(x - 9, y - 20, 18, 6);
  });
  // Round sign on the counter front: the character for tea.
  ctx.fillStyle = '#f5ead2';
  ctx.beginPath(); ctx.arc(135, 452, 20, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b3372a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(135, 452, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#b3372a';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('茶', 135, 453);
  // Hanging lanterns under the awning.
  paperLantern(ctx, 95, 340, 15, '#d94f3d');
  paperLantern(ctx, 190, 345, 12, '#e8a33d');
}

function paintRightStall(ctx) {
  // Parasol.
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(428, 300, 6, 175);
  ctx.fillStyle = '#c93b2e';
  ctx.beginPath(); ctx.moveTo(348, 322); ctx.quadraticCurveTo(431, 268, 514, 322); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ffd97a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(348, 322); ctx.quadraticCurveTo(431, 268, 514, 322); ctx.stroke();
  // Counter and fruit mounds.
  ctx.fillStyle = '#7a4a26';
  ctx.fillRect(335, 428, 195, 52);
  ctx.fillStyle = '#9c6234';
  ctx.fillRect(330, 418, 205, 12);
  const piles = [[372, '#e8823f', 5], [448, '#c93b2e', 5], [505, '#7ba05b', 4]];
  piles.forEach(([x, c, n]) => {
    ctx.fillStyle = c;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(x - 14 + (i % 3) * 13, 412 - Math.floor(i / 3) * 11, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // Lantern post at the right edge.
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(533, 380, 5, 140);
  paperLantern(ctx, 535, 398, 12, '#e8a33d');
}

function paintVendor(ctx) {
  // The vendor, seen from behind his stall: straw hat, indigo robe, apron.
  ctx.fillStyle = '#2c3a6b';
  ctx.beginPath();
  ctx.moveTo(258, 462); ctx.lineTo(268, 396); ctx.lineTo(296, 396); ctx.lineTo(306, 462);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8d9b0';
  ctx.fillRect(264, 400, 36, 62);
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath(); ctx.arc(282, 380, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d9c25a';
  ctx.beginPath(); ctx.ellipse(282, 368, 27, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(282, 366, 12, Math.PI, 0); ctx.fill();
}

function paintCatAndCrates(ctx) {
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(228, 500, 36, 26);
  ctx.fillRect(234, 476, 28, 24);
  ctx.strokeStyle = '#3d2718'; ctx.lineWidth = 1.5;
  ctx.strokeRect(228, 500, 36, 26);
  ctx.strokeRect(234, 476, 28, 24);
  // A ginger cat sitting by the crates, tail curled.
  ctx.fillStyle = '#e08a3c';
  ctx.beginPath(); ctx.ellipse(322, 512, 16, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(322, 488, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(313, 480); ctx.lineTo(315, 470); ctx.lineTo(320, 479); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(325, 479); ctx.lineTo(330, 470); ctx.lineTo(331, 480); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e08a3c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(336, 524); ctx.quadraticCurveTo(352, 520, 348, 504); ctx.stroke();
}

export function paintMarket(ctx) {
  const rng = mulberry32(20261121);
  paintSky(ctx);
  for (let i = 0; i < 42; i++) {
    ctx.fillStyle = `rgba(255, 246, 201, ${0.3 + rng() * 0.6})`;
    ctx.beginPath(); ctx.arc(rng() * W, rng() * 150, 0.8 + rng() * 1.3, 0, Math.PI * 2); ctx.fill();
  }
  paintMoon(ctx);
  rooftops(ctx, 345, ROOFS, [[60, 300, 10, 12], [250, 295, 10, 12], [505, 310, 10, 12]]);
  paintGround(ctx, rng);
  stringLights(ctx, 10, 120, 550, 100, 26, ['#ffd97a', '#ff9a5a', '#9be28a'], rng);
  stringLights(ctx, 10, 178, 550, 196, 30, ['#ffd97a', '#ff8a7a', '#8ac8ff'], rng);
  paintLeftStall(ctx);
  paintRightStall(ctx);
  paintVendor(ctx);
  paintCatAndCrates(ctx);
}

export const marketScene = {
  id: 'market',
  name: 'Lantern Market at Dusk',
  subtitle: 'Two stalls, one cat, and a sky full of lanterns.',
  timeLimit: 180,
  paint: paintMarket,
  differences: [
    {
      x: 180, y: 122, r: 20, label: 'a bird on the string lights',
      paintB(ctx) { perchedBird(ctx, 180, 122, 1); },
    },
    {
      x: 95, y: 340, r: 22, label: 'the hanging lantern turns green',
      paintB(ctx) { paperLantern(ctx, 95, 340, 15, '#4fae62'); },
    },
    {
      x: 135, y: 452, r: 24, label: 'the stall sign changes its character',
      paintB(ctx) {
        ctx.fillStyle = '#f5ead2';
        ctx.beginPath(); ctx.arc(135, 452, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#b3372a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(135, 452, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#b3372a';
        ctx.font = 'bold 22px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('酒', 135, 453);
      },
    },
    {
      x: 205, y: 398, r: 22, label: 'a bamboo steamer appears on the counter',
      paintB(ctx) {
        ctx.fillStyle = '#c9a35a';
        ctx.beginPath(); ctx.ellipse(205, 398, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(205, 388, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8a6a34';
        ctx.fillRect(191, 392, 28, 3);
        ctx.fillRect(191, 382, 28, 3);
      },
    },
    {
      x: 400, y: 321, r: 16, label: 'a rooftop window lights up',
      paintB(ctx) {
        const glow = ctx.createRadialGradient(400, 321, 2, 400, 321, 26);
        glow.addColorStop(0, 'rgba(255, 217, 122, 0.7)');
        glow.addColorStop(1, 'rgba(255, 217, 122, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(400, 321, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd97a';
        ctx.fillRect(395, 315, 10, 12);
      },
    },
    {
      x: 120, y: 70, r: 14, label: 'a bright star appears in the sky',
      paintB(ctx) { fourPointStar(ctx, 120, 70, 9); },
    },
    {
      x: 282, y: 360, r: 20, label: 'the vendor’s hat gains a red band',
      paintB(ctx) {
        ctx.fillStyle = '#c93b2e';
        ctx.beginPath(); ctx.ellipse(282, 363, 20, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      },
    },
  ],
};
