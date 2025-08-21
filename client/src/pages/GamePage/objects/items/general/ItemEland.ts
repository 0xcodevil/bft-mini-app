import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemEland extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'eland');
  }
}

export default ItemEland;