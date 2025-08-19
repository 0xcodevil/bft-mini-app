import Engine from "@game/engine/Engine";

class PlayScene extends Phaser.Scene {
  engine: Engine;
  
  constructor() {
    super('play');
    this.engine = new Engine(this);
  }

  preload() {
    this.load.image('background', '/imgs/game/background.jpg');
    this.load.image('cell', '/imgs/game/cell_land.png');

    this.load.image('cobra', '/imgs/game/cobra.png');
    this.load.image('crocodile', '/imgs/game/crocodile.png');
    this.load.image('eland', '/imgs/game/eland.png');
    this.load.image('giraffe', '/imgs/game/giraffe.png');
    this.load.image('leopard', '/imgs/game/leopard.png');
    this.load.image('rhino', '/imgs/game/rhino.png');
    this.load.image('zebra', '/imgs/game/zebra.png');

    this.load.image('buffalo', '/imgs/game/buffalo.png');
    this.load.image('lion', '/imgs/game/lion.png');
    this.load.image('elephant', '/imgs/game/elephant.png');
  }

  create() {
    this.engine.start();
  }
}

export default PlayScene;