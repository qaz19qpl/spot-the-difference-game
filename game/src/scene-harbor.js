// Scene 2 — Harbor at Dawn. A fishing boat, a lighthouse, a pier with a
// fisherman, and the sun coming up over the water. 9 differences, 150 seconds.
import { mulberry32 } from './prng.js';

const W = 560;
const H = 560;

function gull(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#2a2138'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-4, -6, 0, 0);
  ctx.quadraticCurveTo(4, -6, 10, 0);
  ctx.stroke();
  ctx.restore();
}

function paintSkyAndSun(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2a2350');
  sky.addColorStop(0.55, '#8a4a6b');
  sky.addColorStop(1, '#f2b56b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 300);
  // Early stars fading out.
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = `rgba(255, 246, 201, ${0.2 + rng() * 0.4})`;
    ctx.beginPath(); ctx.arc(rng() * W, rng() * 110, 0.8 + rng(), 0, Math.PI * 2); ctx.fill();
  }
  // Low sun with a warm glow.
  const glow = ctx.createRadialGradient(120, 255, 8, 120, 255, 90);
  glow.addColorStop(0, 'rgba(255, 214, 130, 0.85)');
  glow.addColorStop(1, 'rgba(255, 214, 130, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(120, 255, 90, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd97a';
  ctx.beginPath(); ctx.arc(120, 255, 24, 0, Math.PI * 2); ctx.fill();
  // Gulls already up.
  gull(ctx, 250, 80, 1);
  gull(ctx, 330, 110, 0.8);
  gull(ctx, 420, 70, 1.1);
}

function paintHeadlandAndHouse(ctx) {
  ctx.fillStyle = '#2a2a44';
  ctx.beginPath();
  ctx.moveTo(0, 300); ctx.lineTo(150, 300); ctx.lineTo(150, 262);
  ctx.lineTo(95, 238); ctx.lineTo(40, 264); ctx.lineTo(0, 254);
  ctx.closePath(); ctx.fill();
  // The keeper's cottage on the headland, window dark at dawn.
  ctx.fillStyle = '#3a2a4a';
  ctx.fillRect(55, 232, 46, 30);
  ctx.fillStyle = '#241a3d';
  ctx.beginPath(); ctx.moveTo(50, 232); ctx.lineTo(78, 214); ctx.lineTo(106, 232); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1430';
  ctx.fillRect(72, 244, 10, 12);
}

function paintLighthouse(ctx) {
  ctx.fillStyle = '#f5ead2';
  ctx.beginPath();
  ctx.moveTo(458, 300); ctx.lineTo(488, 300); ctx.lineTo(484, 200); ctx.lineTo(462, 200);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c93b2e';
  ctx.fillRect(460, 262, 26, 14);
  ctx.fillRect(463, 224, 20, 12);
  ctx.fillStyle = '#2a2138';
  ctx.fillRect(456, 196, 34, 8);
  ctx.fillStyle = '#3d3455';
  ctx.fillRect(462, 184, 22, 12);
  ctx.fillStyle = '#8a8fa8';
  ctx.beginPath(); ctx.arc(473, 192, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2a2138';
  ctx.beginPath(); ctx.moveTo(458, 184); ctx.lineTo(473, 172); ctx.lineTo(488, 184); ctx.closePath(); ctx.fill();
}

function paintSea(ctx, rng) {
  const sea = ctx.createLinearGradient(0, 300, 0, H);
  sea.addColorStop(0, '#4a7a9c');
  sea.addColorStop(1, '#1d3a55');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, W, H - 300);
  // The sun's path on the water.
  for (let i = 0; i < 14; i++) {
    ctx.fillStyle = `rgba(255, 214, 130, ${0.12 + rng() * 0.25})`;
    const y = 308 + i * 9 + rng() * 4;
    ctx.fillRect(100 + rng() * 40 - 20, y, 34 - i + rng() * 10, 3);
  }
  // Wave marks.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 26; i++) {
    const x = rng() * W; const y = 315 + rng() * 235;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 12, y - 4, x + 26, y); ctx.stroke();
  }
}

function paintBoats(ctx) {
  // The fishing boat, sail up, flag flying.
  ctx.fillStyle = '#7a3a26';
  ctx.beginPath();
  ctx.moveTo(168, 332); ctx.lineTo(262, 332); ctx.lineTo(246, 358); ctx.lineTo(186, 358);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(168, 332, 94, 5);
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(213, 250, 4, 84);
  ctx.fillStyle = '#f5ead2';
  ctx.beginPath(); ctx.moveTo(217, 258); ctx.lineTo(217, 326); ctx.lineTo(256, 326); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(120, 90, 60, 0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(217, 258); ctx.lineTo(217, 326); ctx.lineTo(256, 326); ctx.closePath(); ctx.stroke();
  // Red flag at the masthead.
  ctx.fillStyle = '#c93b2e';
  ctx.beginPath(); ctx.moveTo(217, 250); ctx.lineTo(238, 256); ctx.lineTo(217, 262); ctx.closePath(); ctx.fill();
  // A small empty rowboat.
  ctx.fillStyle = '#5a3a22';
  ctx.beginPath();
  ctx.moveTo(330, 378); ctx.lineTo(396, 378); ctx.lineTo(384, 396); ctx.lineTo(344, 396);
  ctx.closePath(); ctx.fill();
  // The buoy, red and white.
  ctx.fillStyle = '#c93b2e';
  ctx.fillRect(420, 392, 20, 18);
  ctx.fillStyle = '#f5ead2';
  ctx.fillRect(420, 398, 20, 6);
  ctx.fillStyle = '#c93b2e';
  ctx.beginPath(); ctx.moveTo(420, 392); ctx.lineTo(430, 378); ctx.lineTo(440, 392); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd97a';
  ctx.beginPath(); ctx.arc(430, 376, 3, 0, Math.PI * 2); ctx.fill();
}

function paintPier(ctx, rng) {
  // Wooden pier jutting in from the bottom left.
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.moveTo(0, 470); ctx.lineTo(210, 460); ctx.lineTo(210, 560); ctx.lineTo(0, 560);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(0, 478 + i * 15); ctx.lineTo(210, 468 + i * 15); ctx.stroke();
  }
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(18, 468, 10, 92);
  ctx.fillRect(188, 462, 10, 98);
  // The fisherman, rod out over the water.
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(122, 424); ctx.lineTo(196, 372); ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(196, 372); ctx.lineTo(196, 402); ctx.stroke();
  ctx.fillStyle = '#2c4a6b';
  ctx.beginPath();
  ctx.moveTo(104, 470); ctx.lineTo(110, 424); ctx.lineTo(134, 424); ctx.lineTo(140, 470);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath(); ctx.arc(122, 412, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d9c25a';
  ctx.beginPath(); ctx.ellipse(122, 404, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(122, 402, 9, Math.PI, 0); ctx.fill();
  // A draped fishing net and a bucket.
  ctx.strokeStyle = 'rgba(220, 220, 200, 0.7)'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.moveTo(150 + i * 10, 470); ctx.lineTo(146 + i * 11, 500); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(146, 474 + i * 6); ctx.lineTo(196, 474 + i * 6); ctx.stroke();
  }
  ctx.fillStyle = '#8a8fa8';
  ctx.beginPath(); ctx.ellipse(60, 520, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5a5f78';
  ctx.fillRect(48, 508, 24, 6);
  void rng;
}

export function paintHarbor(ctx) {
  const rng = mulberry32(20261122);
  paintSkyAndSun(ctx, rng);
  paintHeadlandAndHouse(ctx);
  paintSea(ctx, rng);
  paintLighthouse(ctx);
  paintBoats(ctx);
  paintPier(ctx, rng);
}

export const harborScene = {
  id: 'harbor',
  name: 'Harbor at Dawn',
  subtitle: 'The fleet is out, the lighthouse is dark, the fish are biting.',
  timeLimit: 150,
  paint: paintHarbor,
  differences: [
    {
      x: 473, y: 192, r: 24, label: 'the lighthouse lamp lights and throws a beam',
      paintB(ctx) {
        ctx.fillStyle = 'rgba(255, 230, 150, 0.28)';
        ctx.beginPath();
        ctx.moveTo(468, 192); ctx.lineTo(0, 120); ctx.lineTo(0, 250); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffe696';
        ctx.beginPath(); ctx.arc(473, 192, 7, 0, Math.PI * 2); ctx.fill();
      },
    },
    {
      x: 180, y: 70, r: 18, label: 'one more gull joins the sky',
      paintB(ctx) { gull(ctx, 180, 70, 1); },
    },
    {
      x: 226, y: 256, r: 16, label: 'the masthead flag turns blue',
      paintB(ctx) {
        ctx.fillStyle = '#2c5ab8';
        ctx.beginPath(); ctx.moveTo(217, 250); ctx.lineTo(238, 256); ctx.lineTo(217, 262); ctx.closePath(); ctx.fill();
      },
    },
    {
      x: 430, y: 398, r: 20, label: 'the buoy turns green',
      paintB(ctx) {
        ctx.fillStyle = '#3f9e4d';
        ctx.fillRect(420, 392, 20, 18);
        ctx.fillStyle = '#f5ead2';
        ctx.fillRect(420, 398, 20, 6);
      },
    },
    {
      x: 90, y: 500, r: 20, label: 'an extra crate appears on the pier',
      paintB(ctx) {
        ctx.fillStyle = '#7a5a34';
        ctx.fillRect(74, 484, 32, 28);
        ctx.strokeStyle = '#4a2c17'; ctx.lineWidth = 1.5;
        ctx.strokeRect(74, 484, 32, 28);
        ctx.beginPath(); ctx.moveTo(74, 484); ctx.lineTo(106, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(106, 484); ctx.lineTo(74, 512); ctx.stroke();
      },
    },
    {
      x: 175, y: 486, r: 18, label: 'a silver fish lands in the net',
      paintB(ctx) {
        ctx.fillStyle = '#c8d4dc';
        ctx.beginPath(); ctx.ellipse(175, 486, 14, 6, -0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(188, 482); ctx.lineTo(196, 477); ctx.lineTo(196, 491); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2a2138';
        ctx.beginPath(); ctx.arc(166, 484, 1.6, 0, Math.PI * 2); ctx.fill();
      },
    },
    {
      x: 77, y: 250, r: 16, label: 'the cottage window lights up',
      paintB(ctx) {
        const glow = ctx.createRadialGradient(77, 250, 2, 77, 250, 24);
        glow.addColorStop(0, 'rgba(255, 217, 122, 0.7)');
        glow.addColorStop(1, 'rgba(255, 217, 122, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(77, 250, 24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd97a';
        ctx.fillRect(72, 244, 10, 12);
      },
    },
    {
      x: 232, y: 300, r: 18, label: 'a patch appears on the sail',
      paintB(ctx) {
        ctx.fillStyle = '#c96a3b';
        ctx.beginPath(); ctx.arc(232, 300, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#7a3a26'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(232, 300, 9, 0, Math.PI * 2); ctx.stroke();
      },
    },
    {
      x: 160, y: 530, r: 18, label: 'a coil of rope appears on the pier',
      paintB(ctx) {
        ctx.strokeStyle = '#c9a35a'; ctx.lineWidth = 4;
        [13, 8, 3].forEach((r) => {
          ctx.beginPath(); ctx.arc(160, 530, r, 0, Math.PI * 2); ctx.stroke();
        });
      },
    },
  ],
};
