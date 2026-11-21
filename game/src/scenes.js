// The three scenes of the game, easiest first. Each scene owns its painter and
// its list of differences; the game logic never knows what a scene looks like,
// only how many differences it hides and where they are.
import { marketScene } from './scene-market.js';
import { harborScene } from './scene-harbor.js';
import { teaHouseScene } from './scene-teahouse.js';

export const SCENES = [marketScene, harborScene, teaHouseScene];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
