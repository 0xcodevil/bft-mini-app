import { IEngine, ISwapManager } from "./type";
import Item from "../objects/items/Item";

class SwapManager implements ISwapManager {
  disabled = true;
  from?: Item;
  to?: Item;

  constructor(public engine: IEngine) { }

  dragStart(from: Item) {
    if (this.disabled) return;

    this.from = from;
  }

  dragEnd(position: Item) {
    if (this.disabled) return;
    
    this.to = position;
    
    if (this.from && this.to && this.from.position.distance(this.to.position) === 1) {
      this.disableSwap();
      this.engine.itemManager.swap(this.from, this.to);
    }

    this.from = undefined;
    this.to = undefined;
  }

  enableSwap() {
    this.disabled = false;
  }

  disableSwap() {
    this.disabled = true;
  }
}

export default SwapManager;