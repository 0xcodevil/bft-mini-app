import { GameObjects, Scene } from "phaser";
import { CELL_SIZE } from "@game/engine/utils/config";

class Cell extends GameObjects.Image {
  constructor(scene: Scene, x: number, y: number ) {
    super(scene, x, y, 'cell');
    this.setDisplaySize(CELL_SIZE, CELL_SIZE);
    scene.add.existing(this);
  }
}

export default Cell;