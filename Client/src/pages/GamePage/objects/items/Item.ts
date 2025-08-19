import { IEngine } from "../../engine/type";
import { GameObjects, Math } from "phaser";
import Utils from "@game/engine/utils/libs";
import { ITEM_SIZE } from "@game/engine/utils/config";

class Item extends GameObjects.Image {
  position: Math.Vector2;

  constructor(public engine: IEngine, x: number, y: number, texture: string) {
    const [posX, posY] = Utils.getRealPosition(engine.scene, x, y);
    super(engine.scene, posX, posY, texture);

    this.setDisplaySize(ITEM_SIZE, ITEM_SIZE).setInteractive();

    this.position = new Math.Vector2(x, y);

    engine.scene.add.existing(this);

    this.on('pointerdown', this.handlePointerDown);
    this.on('pointerup', this.handlePointerUp);
  }

  moveTo(x: number, y: number) {
    this.position.set(x, y);
    const [posX, posY] = Utils.getRealPosition(this.engine.scene, x, y);
    this.engine.scene.tweens.add({
      targets: this,
      x: posX,
      y: posY,
      duration: 1000,
      ease: 'Bounce.easeOut',
    });
  }

  swap(dest: Item) {
    const temp = new Math.Vector2(this.position);
    this.position.set(dest.position.x, dest.position.y);
    dest.position.set(temp.x, temp.y);

    const tempPos = { x: this.x, y: this.y };
    this.engine.scene.tweens.addMultiple([
      {
        targets: this,
        x: dest.x,
        y: dest.y,
        duration: 200,
        ease: 'Linear',
      },
      {
        targets: dest,
        x: tempPos.x,
        y: tempPos.y,
        duration: 200,
        ease: 'Linear',
      }
    ]);
  }

  handlePointerDown() {
    this.engine.swapManager.dragStart(this);
  }

  handlePointerUp() {
    this.engine.swapManager.dragEnd(this);
  }

  destroy(ignoreAnim?: boolean) {
    if (ignoreAnim) super.destroy();
    else this.engine.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 200,
      ease: 'Linear',
      onComplete: () => super.destroy()
    });
  }
}

export default Item;