import { Scene } from "phaser";
import Item from "../objects/items/Item";

export interface IItemManager {
  updateItems(): void;
  swap(from: Item, to: Item): void;
  reset(): void;
}

export interface ILevelManager {
  addScore(amount: number): void;
  addMove(): void;
  checkLevelResult(): void;
  reset(): void;
}

export interface ISwapManager {
  dragStart(from: Item): void;
  dragEnd(position: Item): void;
  enableSwap(): void;
  disableSwap(): void;
}

export interface IEngine {
  scene: Scene;
  levelManager: ILevelManager;
  itemManager: IItemManager;
  swapManager: ISwapManager;
  saveScore(): void;
}