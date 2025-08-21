import { Scene } from "phaser";
import Board from "@game/objects/Board/Board";
import ItemManager from "./ItemManager";
import SwapManager from "@game/engine/SwapManager";
import LevelManager from "./LevelManager";

import { IEngine } from "./type";
import { EVENT } from "./utils/constants";

import { API, apiErrorHandler } from "@/libs/API";
import Crypto from "@/libs/crypto";

class Engine implements IEngine {
  gameId?: string;
  board: Board;
  levelManager: LevelManager;
  itemManager: ItemManager;
  swapManager: SwapManager;

  constructor(public scene: Scene) {
    this.board = new Board(scene);
    this.levelManager = new LevelManager(this);
    this.itemManager = new ItemManager(this);
    this.swapManager = new SwapManager(this);
  }

  start() {
    this.scene.game.events.on(EVENT.GAME_RESTART, this.restart, this);

    this.board.drawBoard();

    API.post('/play/start').then(res => {
      this.gameId = res.data.gameId;
      this.levelManager.levelUp();
      this.itemManager.updateItems();
    }).catch(apiErrorHandler);
  }

  restart() {
    this.levelManager.reset();
    this.itemManager.reset();
    
    this.itemManager.updateItems();
  }

  saveScore() {
    const data = Crypto.encrypt({
      score: this.levelManager.score,
      gameId: this.gameId,
    });
    API.post('/play/result', { data }).catch(apiErrorHandler);
  }
}

export default Engine;