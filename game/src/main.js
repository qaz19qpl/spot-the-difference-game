// Boot: one Game owns the page. No build step, no network, no libraries —
// the whole game is the ES modules under src/ and the two canvas panels.
import { Game } from './game.js';

const game = new Game();
window.__lanternMarket = game;
