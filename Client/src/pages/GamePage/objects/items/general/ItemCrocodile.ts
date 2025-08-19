import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemCrocodile extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'crocodile');
  }
}

export default ItemCrocodile;