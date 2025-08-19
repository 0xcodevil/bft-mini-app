import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemZebra extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'zebra');
  }
}

export default ItemZebra;