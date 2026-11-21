// Game state: levels, timer, score, combo, hints, overlays, and the staged
// screenshot states the maker uses (?shot=cover|level2|complete|menu, the same
// pattern the kit's starter uses in shots.json). The game never reaches for
// the network and never reads the clock except for its own timer.
import { SCENES } from './scenes.js';
import { Renderer } from './render.js';
import { Input } from './input.js';
import { SoundFX } from './audio.js';

const $ = (id) => document.getElementById(id);

export class Game {
  constructor() {
    this.renderer = new Renderer($('panelA'), $('panelB'));
    this.sfx = new SoundFX();
    this.sceneIndex = 0;
    this.found = new Set();
    this.foundAt = new Map();
    this.score = 0;
    this.combo = 0;
    this.hintsLeft = 3;
    this.timeLeftMs = 0;
    this.state = 'menu'; // menu | playing | levelClear | timeUp | victory
    this.paused = false;
    this.misses = [];
    this.floats = [];
    this.hintTarget = null;
    this.hintUntil = 0;
    this.crosshair = { panel: 'A', x: 280, y: 280, visible: false };
    this.best = Number(window.localStorage.getItem('lantern-market-best') || 0);
    this.lastTick = performance.now();
    this.startedAt = performance.now();

    this.input = new Input($('panelA'), $('panelB'), {
      onPick: (panel, x, y) => this.pick(panel, x, y),
      onHover: (panel, x, y) => { this.crosshair = { panel, x, y, visible: true }; },
      onMove: (dir) => this.moveCrosshair(dir),
      onConfirm: () => this.confirmCrosshair(),
      onSwitchPanel: () => {
        this.crosshair.panel = this.crosshair.panel === 'A' ? 'B' : 'A';
        this.crosshair.visible = true;
      },
      onHint: () => this.useHint(),
      onMute: () => this.toggleMute(),
      onRestart: () => this.startLevel(this.sceneIndex),
      onMenu: () => this.showMenu(),
    });

    $('hintBtn').addEventListener('click', () => this.useHint());
    $('muteBtn').addEventListener('click', () => this.toggleMute());
    $('restartBtn').addEventListener('click', () => this.startLevel(this.sceneIndex));
    $('menuBtn').addEventListener('click', () => this.showMenu());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.paused = true;
    });
    window.addEventListener('pointerdown', () => this.sfx.unlock(), { once: true });
    window.addEventListener('keydown', () => this.sfx.unlock(), { once: true });

    this.applyShot(new URLSearchParams(window.location.search).get('shot'));
    if (this.state === 'menu') this.showMenu();
    requestAnimationFrame((t) => this.frame(t));
  }

  get scene() { return SCENES[this.sceneIndex]; }

  startLevel(index) {
    this.sceneIndex = index;
    this.found = new Set();
    this.foundAt = new Map();
    this.combo = 0;
    this.hintsLeft = 3;
    this.timeLeftMs = this.scene.timeLimit * 1000;
    this.misses = [];
    this.floats = [];
    this.hintTarget = null;
    this.state = 'playing';
    this.paused = false;
    this.startedAt = performance.now();
    this.renderer.drawScene(this.scene);
    $('overlay').classList.add('hidden');
    $('levelName').textContent = `Level ${index + 1} — ${this.scene.name}`;
    $('totalCount').textContent = this.scene.differences.length;
    this.setStatus(`Find all ${this.scene.differences.length} differences before the lanterns burn down.`);
    this.updateHud();
  }

  pick(panel, x, y) {
    if (this.state !== 'playing' || this.paused) return;
    this.sfx.unlock();
    this.crosshair = { panel, x, y, visible: true };
    const now = performance.now();
    let best = null;
    let bestDist = Infinity;
    this.scene.differences.forEach((diff, i) => {
      if (this.found.has(i)) return;
      const d = Math.hypot(diff.x - x, diff.y - y);
      if (d < diff.r + 8 && d < bestDist) { best = i; bestDist = d; }
    });
    if (best !== null) {
      const diff = this.scene.differences[best];
      this.found.add(best);
      this.foundAt.set(best, now);
      this.combo += 1;
      const gained = 100 + (this.combo - 1) * 25;
      this.score += gained;
      this.floats.push({ text: `+${gained}`, x: diff.x, y: diff.y - diff.r - 6, at: now, panel });
      this.sfx.found(this.combo);
      this.setStatus(`Found it — ${diff.label}. ${this.scene.differences.length - this.found.size} to go.`);
      if (this.found.size === this.scene.differences.length) this.levelClear();
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - 25);
      this.misses.push({ x, y, at: now, panel });
      this.sfx.wrong();
      const canvas = panel === 'A' ? $('panelA') : $('panelB');
      canvas.classList.remove('shake');
      void canvas.offsetWidth;
      canvas.classList.add('shake');
      this.setStatus('Not there — minus 25 points. Look closer.');
    }
    this.updateHud();
  }

  moveCrosshair(dir) {
    const step = 14;
    const c = this.crosshair;
    c.visible = true;
    if (dir === 'left') c.x = Math.max(10, c.x - step);
    if (dir === 'right') c.x = Math.min(550, c.x + step);
    if (dir === 'up') c.y = Math.max(10, c.y - step);
    if (dir === 'down') c.y = Math.min(550, c.y + step);
  }

  confirmCrosshair() {
    if (!this.crosshair.visible) this.crosshair.visible = true;
    this.pick(this.crosshair.panel, this.crosshair.x, this.crosshair.y);
  }

  useHint() {
    if (this.state !== 'playing' || this.paused) return;
    if (this.hintsLeft <= 0) { this.setStatus('No hints left on this level.'); return; }
    const remaining = this.scene.differences.filter((_, i) => !this.found.has(i));
    if (remaining.length === 0) return;
    this.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintUntil = performance.now() + 2500;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 50);
    this.sfx.hint();
    this.setStatus('A hint rings one difference in gold — minus 50 points.');
    this.updateHud();
  }

  toggleMute() {
    const muted = this.sfx.toggleMute();
    $('muteBtn').textContent = muted ? '🔇 Muted' : '🔊 Sound';
  }

  levelClear() {
    const bonus = Math.ceil(this.timeLeftMs / 1000) * 10;
    this.score += bonus;
    this.state = 'levelClear';
    this.sfx.win();
    const frac = this.timeLeftMs / (this.scene.timeLimit * 1000);
    const stars = frac > 0.5 ? '★★★' : frac > 0.25 ? '★★☆' : '★☆☆';
    const last = this.sceneIndex === SCENES.length - 1;
    if (this.score > this.best) {
      this.best = this.score;
      window.localStorage.setItem('lantern-market-best', String(this.best));
    }
    $('overlayCard').innerHTML = `
      <h2>${last ? 'You found them all!' : 'Level clear!'}</h2>
      <div class="stars">${stars}</div>
      <p class="big">${this.scene.name} — all ${this.scene.differences.length} differences found</p>
      <p>Time bonus +${bonus} · Score ${this.score} · Best ${this.best}</p>
      <div class="row">
        ${last
          ? '<button type="button" id="ovAgain">↻ Play again</button><button type="button" id="ovMenu">☰ Levels</button>'
          : '<button type="button" id="ovNext">Next level →</button><button type="button" id="ovMenu">☰ Levels</button>'}
      </div>`;
    $('overlay').classList.remove('hidden');
    if (last) {
      this.state = 'victory';
      $('ovAgain').addEventListener('click', () => this.startLevel(0));
    } else {
      $('ovNext').addEventListener('click', () => this.startLevel(this.sceneIndex + 1));
    }
    $('ovMenu').addEventListener('click', () => this.showMenu());
    this.updateHud();
  }

  timeUp() {
    this.state = 'timeUp';
    this.sfx.lose();
    $('overlayCard').innerHTML = `
      <h2>Time's up!</h2>
      <p class="big">You found ${this.found.size} of ${this.scene.differences.length} differences.</p>
      <p>${this.scene.differences.length - this.found.size} ${this.scene.differences.length - this.found.size === 1 ? 'difference' : 'differences'} still hiding in the ${this.scene.name.toLowerCase()}.</p>
      <div class="row">
        <button type="button" id="ovRetry">↻ Try again</button>
        <button type="button" id="ovMenu">☰ Levels</button>
      </div>`;
    $('overlay').classList.remove('hidden');
    $('ovRetry').addEventListener('click', () => this.startLevel(this.sceneIndex));
    $('ovMenu').addEventListener('click', () => this.showMenu());
  }

  showMenu() {
    this.state = 'menu';
    this.paused = false;
    $('overlayCard').innerHTML = `
      <h2>Lantern Market — Spot the Difference</h2>
      <p>Two pictures hang side by side. They look the same — they aren't.
      Find every difference before the timer runs out. Three scenes, 28
      differences, and a cat that never helps.</p>
      <div class="level-pick">
        ${SCENES.map((s, i) => `<button type="button" data-level="${i}">
          <b>Level ${i + 1} — ${s.name}</b><br>
          <small>${s.differences.length} differences · ${Math.floor(s.timeLimit / 60)}:${String(s.timeLimit % 60).padStart(2, '0')} on the clock · ${s.subtitle}</small>
        </button>`).join('')}
      </div>
      <p><small>Click a difference on either picture · Arrow keys + Enter work too · H hints, M mutes, R restarts · Best score ${this.best}</small></p>`;
    $('overlay').classList.remove('hidden');
    $('overlayCard').querySelectorAll('[data-level]').forEach((btn) => {
      btn.addEventListener('click', () => this.startLevel(Number(btn.dataset.level)));
    });
  }

  setStatus(text) { $('statusLine').textContent = text; }

  updateHud() {
    $('foundCount').textContent = this.found.size;
    $('remainCount').textContent = `${this.scene.differences.length - this.found.size} remain`;
    $('scoreValue').textContent = this.score;
    $('comboValue').textContent = this.combo > 1 ? `🔥 Combo ×${this.combo}` : '';
    $('hintCount').textContent = this.hintsLeft;
    $('hintBtn').disabled = this.hintsLeft <= 0 || this.state !== 'playing';
    const secs = Math.max(0, Math.ceil(this.timeLeftMs / 1000));
    $('timerText').textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    const frac = this.timeLeftMs / (this.scene.timeLimit * 1000);
    $('timerFill').style.width = `${Math.max(0, frac * 100)}%`;
    $('timerFill').classList.toggle('low', frac < 0.25);
  }

  // Staged states for the maker's screenshots (see shots.json in the kit's
  // starter): each one is a state a player reaches by playing, rendered by
  // the game's own code in a real browser.
  applyShot(shot) {
    if (!shot) return;
    if (shot === 'menu') { this.sceneIndex = 0; this.renderer.drawScene(this.scene); this.timeLeftMs = this.scene.timeLimit * 1000; return; }
    if (shot === 'cover') {
      this.startLevel(0);
      [0, 2, 4, 5].forEach((i) => { this.found.add(i); this.foundAt.set(i, performance.now() - 1000); });
      this.score = 450; this.combo = 4; this.timeLeftMs = 132000;
      this.setStatus('Found it — the stall sign changes its character. 3 to go.');
      this.updateHud();
      return;
    }
    if (shot === 'level2') {
      this.startLevel(1);
      [1, 7].forEach((i) => { this.found.add(i); this.foundAt.set(i, performance.now() - 1000); });
      this.score = 760; this.combo = 2; this.timeLeftMs = 98000;
      this.setStatus('Found it — a patch appears on the sail. 7 to go.');
      this.updateHud();
      return;
    }
    if (shot === 'complete') {
      this.startLevel(0);
      this.scene.differences.forEach((_, i) => { this.found.add(i); this.foundAt.set(i, performance.now() - 1000); });
      this.score = 940; this.combo = 7; this.timeLeftMs = 96000;
      this.levelClear();
    }
  }

  frame(now) {
    const dt = Math.min(100, now - this.lastTick);
    this.lastTick = now;
    if (this.state === 'playing' && !this.paused) {
      this.timeLeftMs -= dt;
      if (this.timeLeftMs <= 0) {
        this.timeLeftMs = 0;
        this.updateHud();
        this.timeUp();
      } else {
        this.updateHud();
      }
    }
    this.renderer.blit();
    const ctxA = this.renderer.ctxA;
    const ctxB = this.renderer.ctxB;
    this.found.forEach((i) => {
      const diff = this.scene.differences[i];
      const age = now - (this.foundAt.get(i) || now);
      this.renderer.drawFoundMarker(ctxA, diff, age);
      this.renderer.drawFoundMarker(ctxB, diff, age);
    });
    this.misses = this.misses.filter((m) => now - m.at < 500);
    this.misses.forEach((m) => {
      this.renderer.drawMissMark(m.panel === 'A' ? ctxA : ctxB, m.x, m.y, now - m.at);
    });
    if (this.hintTarget && now < this.hintUntil && this.state === 'playing') {
      this.renderer.drawHintRing(ctxA, this.hintTarget, now);
      this.renderer.drawHintRing(ctxB, this.hintTarget, now);
    }
    this.floats = this.floats.filter((f) => now - f.at < 900);
    this.floats.forEach((f) => {
      this.renderer.drawFloatText(f.panel === 'A' ? ctxA : ctxB, f.text, f.x, f.y, now - f.at);
    });
    if (this.crosshair.visible && this.state === 'playing') {
      const ctx = this.crosshair.panel === 'A' ? ctxA : ctxB;
      this.renderer.drawCrosshair(ctx, this.crosshair.x, this.crosshair.y, true);
    }
    requestAnimationFrame((t) => this.frame(t));
  }
}
