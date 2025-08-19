import { Scene } from "phaser";
import Cell from "./Cell";
import { GRID_WIDTH, GRID_HEIGHT } from "@game/engine/utils/config";
import Utils from "@game/engine/utils/libs";

class Board {
  cells: Cell[][] = [];

  constructor(public scene: Scene) { }

  drawBoard() {
    for (let x = 0; x < GRID_WIDTH; x++) {
      this.cells.push([]);
      for (let y = 0; y < GRID_HEIGHT; y++) {
        const [posX, posY] = Utils.getRealPosition(this.scene, x, y);
        this.cells[x].push(new Cell(this.scene, posX, posY));
      }
    }
  }
}

export default Board;