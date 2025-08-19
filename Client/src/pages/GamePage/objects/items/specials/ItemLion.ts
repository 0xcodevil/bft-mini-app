import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemLion extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'lion');
  }
}

export default ItemLion;