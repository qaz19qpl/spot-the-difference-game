# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qaz19qpl/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qaz19qpl/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lantern Market — Spot the Difference: a complete, original spot-the-difference game that runs offline in a desktop browser from static files. Two near-identical hand-drawn scenes hang side by side; find every difference before the timer runs out. Three original scenes (Lantern Market at Dusk, Harbor at Dawn, Tea House in the Snow), 28 differences in all, hints, combos, time bonuses, keyboard play, and synthesized sound effects — no images, no libraries, no network.

## Run it

```sh
node --version # 22.18 or later
python3 -m http.server 8080 --directory game
# open http://localhost:8080 in desktop Chrome
```

Or serve `game/` with any static HTTP server and open `index.html`. Click a difference on either picture, or use arrow keys + Enter. `H` hints, `M` mutes, `R` restarts, `Esc` opens the level select.

## Layout

- `game/index.html` + `game/styles.css` — page shell, HUD, panels
- `game/src/main.js` — boot; `game/src/game.js` — levels, timer, score, overlays
- `game/src/scenes.js` — the three scenes; `game/src/scene-market.js`, `scene-harbor.js`, `scene-teahouse.js` — each scene's painting and its differences
- `game/src/draw-helpers.js` — shared painters (lanterns, stars, birds, string lights, rooftops); `game/src/render.js` — panels, markers, hint rings; `game/src/input.js` — mouse + keyboard; `game/src/audio.js` — WebAudio effects; `game/src/prng.js` — seeded random so every scene paints identically on every load
- `main.ts` — the make.fun entry program; `vendor/makefun-game.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?ref=mq95vk6b&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
