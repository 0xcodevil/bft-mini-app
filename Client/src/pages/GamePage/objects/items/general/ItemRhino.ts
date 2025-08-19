import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemRhino extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'rhino');
  }
}

export default ItemRhino;