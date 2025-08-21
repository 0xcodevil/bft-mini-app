import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } from "./engine/utils/config";

class MatchGame extends Phaser.Game {
  constructor() {
    super({
      width: GRID_WIDTH * CELL_SIZE + 2,
      height: GRID_HEIGHT * CELL_SIZE + 2,
      parent: "container",
      transparent: true,
      scene: PlayScene
    });
  }
}

export default MatchGame;