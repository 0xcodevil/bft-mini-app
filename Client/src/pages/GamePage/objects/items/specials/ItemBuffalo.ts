import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemBuffalo extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'buffalo');
  }
}

export default ItemBuffalo;