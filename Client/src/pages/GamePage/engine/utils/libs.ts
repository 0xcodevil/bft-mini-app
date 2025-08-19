import { Scene } from "phaser";
import { GENERAL_ITEM, GENERAL_ITEM_TYPE } from "./constants";
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } from "./config";

const Utils = {
  getRandomItem: function (): GENERAL_ITEM_TYPE {
    const values = Object.values(GENERAL_ITEM).filter(item => item !== GENERAL_ITEM.EMPTY);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex] as GENERAL_ITEM_TYPE;
  },

  getRealPosition: function (scene: Scene, gridX: number, gridY: number) {
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    const gridPixelWidth = GRID_WIDTH * CELL_SIZE;
    const gridPixelHeight = GRID_HEIGHT * CELL_SIZE;

    const offsetX = (screenWidth - gridPixelWidth) / 2;
    const offsetY = (screenHeight - gridPixelHeight) / 2;

    const x = offsetX + gridX * CELL_SIZE + CELL_SIZE / 2;
    const y = offsetY + gridY * CELL_SIZE + CELL_SIZE / 2;

    return [x, y];
  },

  getLevel: function (score: number) {
    const initialScore = 500;
    const scoreStep = 50;

    let level = 0;
    let scoreTarget = 0;
    do {
      level++;
      scoreTarget = initialScore * level + scoreStep * (level - 1) * level / 2;
    } while (score >= scoreTarget)
    
    return level;
  }
}

export default Utils;