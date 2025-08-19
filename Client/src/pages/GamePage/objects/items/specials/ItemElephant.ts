import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemElephant extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'elephant');
  }
}

export default ItemElephant;