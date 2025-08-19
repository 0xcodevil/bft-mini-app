import { IEngine } from "@game/engine/type";
import Item from "../Item";

class ItemLeopard extends Item {
  constructor(engine: IEngine, x: number, y: number) {
    super(engine, x, y, 'leopard');
  }
}

export default ItemLeopard;