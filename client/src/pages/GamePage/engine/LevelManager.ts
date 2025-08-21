import { EVENT } from "./utils/constants";
import { IEngine, ILevelManager } from "./type";

class LevelManager implements ILevelManager {
  private readonly initialScore = 500;
  private readonly scoreStep = 50;
  private readonly moveLimit = 10;

  level = 0;
  score = 0;
  scoreTarget = 0;
  move = 0;

  success = false;

  constructor(public engine: IEngine) { }

  private canLevelUp() {
    return this.score >= this.scoreTarget;
  }

  levelUp() {
    this.move = 0;
    this.success = false;
    this.level++;
    this.scoreTarget = this.initialScore * this.level + this.scoreStep * (this.level - 1) * this.level / 2;
    this.engine.scene.game.events.emit(EVENT.GAME_LEVEL, this.level);
    this.engine.scene.game.events.emit(EVENT.GAME_MOVE, this.move);
    this.engine.scene.game.events.emit(EVENT.GAME_MOVE_LIMIT, this.moveLimit);
    this.engine.scene.game.events.emit(EVENT.GAME_SCORE, this.score);
    this.engine.scene.game.events.emit(EVENT.GAME_SCORE_TARGET, this.scoreTarget);
  }

  addScore(amount: number) {
    this.score += amount;
    this.engine.scene.game.events.emit(EVENT.GAME_SCORE, this.score);
  }

  addMove() {
    this.move++;
    this.engine.scene.game.events.emit(EVENT.GAME_MOVE, this.move);
  }

  checkLevelResult() {
    if (!this.success && this.canLevelUp()) {
      this.success = true;
      this.engine.scene.game.events.emit(EVENT.GAME_LEVEL_SUCCESS);
    }

    if (this.move >= this.moveLimit) {
      if (this.success) {
        this.levelUp();
        this.engine.swapManager.enableSwap();
      }
      else {
        this.engine.scene.game.events.emit(EVENT.GAME_LEVEL_FAILURE);
        this.engine.saveScore();
      }
    } else {
      this.engine.swapManager.enableSwap();
    }
  }

  reset() {
    this.level = 0;
    this.score = 0;
    this.scoreTarget = 0;
    this.move = 0;
    this.levelUp();
  }
}

export default LevelManager;