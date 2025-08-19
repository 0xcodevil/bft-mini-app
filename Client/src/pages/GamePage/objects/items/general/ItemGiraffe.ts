import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemGiraffe extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'giraffe');
  }
}

export default ItemGiraffe;