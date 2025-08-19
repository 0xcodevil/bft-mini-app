import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemCobra extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'cobra');
  }
}

export default ItemCobra;