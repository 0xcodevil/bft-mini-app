import { IEngine, IItemManager } from "./type";
import Item from "@game/objects/items/Item";
import { ITEM_TYPE, GENERAL_ITEM } from "@game/engine/utils/constants";
import { GRID_WIDTH, GRID_HEIGHT, POINT_PER_ITEM } from "@game/engine/utils/config";
import Utils from "@game/engine/utils/libs";
import { ItemCobra, ItemCrocodile,/* ItemEland, ItemGiraffe,*/ ItemLeopard, ItemRhino, ItemZebra } from "@game/objects/items";

class ItemManager implements IItemManager {
  items: Array<Array<ITEM_TYPE>>;
  itemObjects: Array<Item>;

  constructor(public engine: IEngine) {
    this.items = Array.from({ length: GRID_WIDTH }, () =>
      Array.from({ length: GRID_HEIGHT }, () => GENERAL_ITEM.EMPTY)
    );
    this.itemObjects = [];
  }

  updateItems() {
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (this.items[x][y] === GENERAL_ITEM.EMPTY) {
          if (y === 0) this.addNewItem(x);
          else for (let j = y - 1; j >= 0; j--) {
            if (this.items[x][j] === GENERAL_ITEM.EMPTY) {
              if (j === 0) this.addNewItem(x, y);
              continue;
            }
            this.moveItems(x, j, x, y);
            break;
          }
        }
      }
    }

    this.engine.scene.time.delayedCall(1200, this.checkMatched, [], this);
  }

  private checkMatched() {
    const positions = new Set<string>();

    // Check horizontal matches
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let count = 1;
      for (let x = 1; x <= GRID_WIDTH; x++) {
        if (x < GRID_WIDTH && this.items[x][y] === this.items[x - 1][y]) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = 0; k < count; k++) {
              positions.add(`${x - 1 - k}:${y}`);
            }
          }
          count = 1;
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < GRID_WIDTH; x++) {
      let count = 1;
      for (let y = 1; y <= GRID_HEIGHT; y++) {
        if (y < GRID_HEIGHT && this.items[x][y] === this.items[x][y - 1]) {
          count++;
        } else {
          if (count >= 3) {
            for (let k = 0; k < count; k++) {
              positions.add(`${x}:${y - 1 - k}`);
            }
          }
          count = 1;
        }
      }
    }

    const removed = this.removeItems(positions);
    if (removed) {
      this.engine.scene.time.delayedCall(400, this.updateItems, [], this);
    } else {
      this.engine.levelManager.checkLevelResult();
    }

    return removed;
  }

  private addNewItem(x: number, y = 0) {
    this.items[x][y] = Utils.getRandomItem();

    let item: Item;
    if (this.items[x][y] === GENERAL_ITEM.COBRA) item = new ItemCobra(this.engine, x, -1);
    if (this.items[x][y] === GENERAL_ITEM.CROCODILE) item = new ItemCrocodile(this.engine, x, -1);
    // if (this.items[x][y] === GENERAL_ITEM.ELAND) item = new ItemEland(this.engine, x, -1);
    // if (this.items[x][y] === GENERAL_ITEM.GIRAFFE) item = new ItemGiraffe(this.engine, x, -1);
    if (this.items[x][y] === GENERAL_ITEM.LEOPARD) item = new ItemLeopard(this.engine, x, -1);
    if (this.items[x][y] === GENERAL_ITEM.RHINO) item = new ItemRhino(this.engine, x, -1);
    if (this.items[x][y] === GENERAL_ITEM.ZEBRA) item = new ItemZebra(this.engine, x, -1);

    this.itemObjects.push(item!);
    item!.moveTo(x, y);
  }

  private moveItems(fromX: number, fromY: number, toX: number, toY: number) {
    this.items[toX][toY] = this.items[fromX][fromY];
    this.items[fromX][fromY] = GENERAL_ITEM.EMPTY;

    const itemObject = this.itemObjects.find(item => item.position.x === fromX && item.position.y === fromY);
    if (itemObject) itemObject.moveTo(toX, toY);
  }

  private removeItems(positions: Set<string>) {
    if (positions.size > 0) {
      this.engine.levelManager.addScore(POINT_PER_ITEM * positions.size);
      this.itemObjects = this.itemObjects.filter((item) => {
        if (positions.has(`${item.position.x}:${item.position.y}`)) {
          this.items[item.position.x][item.position.y] = GENERAL_ITEM.EMPTY;
          item.destroy();
          return false;
        } else return true;
      });

      return true;
    } else return false;
  }

  swap(from: Item, to: Item) {
    let temp = this.items[from.position.x][from.position.y];
    this.items[from.position.x][from.position.y] = this.items[to.position.x][to.position.y];
    this.items[to.position.x][to.position.y] = temp;

    from.swap(to);

    this.engine.scene.time.delayedCall(300, () => {
      const matched = this.checkMatched();
      if (matched) {
        this.engine.levelManager.addMove();
      } else {
        temp = this.items[to.position.x][to.position.y];
        this.items[to.position.x][to.position.y] = this.items[from.position.x][from.position.y];
        this.items[from.position.x][from.position.y] = temp;
        from.swap(to);
      }
    });
  }

  reset() {
    this.items = Array.from({ length: GRID_WIDTH }, () =>
      Array.from({ length: GRID_HEIGHT }, () => GENERAL_ITEM.EMPTY)
    );
    this.itemObjects.forEach(obj => obj.destroy(true));
    this.itemObjects = [];
  }
}

export default ItemManager;