import { useState, useEffect, useRef } from "react";
import Game from "./Game";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import { EVENT } from "./engine/utils/constants";
import { Link } from "react-router-dom";

const GamePage = () => {
  const gameRef = useRef<Game | null>(null);

  const [level, setLevel] = useState(0);
  const [move, setMove] = useState(0);
  const [moveLimit, setMoveLimit] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreTarget, setScoreTarget] = useState(1);

  const [levelUp, setLevelUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const showLevelUp = () => {
    setLevelUp(true);
    setTimeout(setLevelUp, 2000, false);
  }

  const showGameOver = () => {
    setGameOver(true);
  }

  const restartGame = () => {
    if (gameRef.current) {
      gameRef.current.events.emit(EVENT.GAME_RESTART);
    }
    setGameOver(false);
  }

  useEffect(() => {
    const game = new Game();
    gameRef.current = game;

    game.events.on(EVENT.GAME_LEVEL, setLevel);
    game.events.on(EVENT.GAME_MOVE, setMove);
    game.events.on(EVENT.GAME_MOVE_LIMIT, setMoveLimit);
    game.events.on(EVENT.GAME_SCORE, setScore);
    game.events.on(EVENT.GAME_SCORE_TARGET, setScoreTarget);
    game.events.on(EVENT.GAME_LEVEL_SUCCESS, showLevelUp);
    game.events.on(EVENT.GAME_LEVEL_FAILURE, showGameOver);
    return () => {
      game.destroy(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[url('/imgs/game/background.jpg')] bg-cover bg-center">
      <div className="w-full max-w-md px-4 mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="bg-white rounded-b-xl px-5 pb-1">Level: <span className="font-bold text-primary">{level}</span></div>
        </div>
        <Card className="space-y-4">
          <div className="grid grid-cols-2">
            <div className="text-center">
              <div className="text-muted text-sm">Moves</div>
              <div className="text-secondary font-bold text-xl">
                <span className="">{move}</span> / <span className="text-primary">{moveLimit}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted text-sm">Score</div>
              <div className="text-secondary font-bold text-xl">
                <span className="">{score}</span> / <span className="text-primary">{scoreTarget}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div>Level Progress</div>
              <div className="">{Math.floor(Math.min(score / scoreTarget * 100, 100))}%</div>
            </div>
            <Progress value={score / scoreTarget * 100} />
          </div>
        </Card>
      </div>
      <div id="container" />
      <div className=""></div>

      {levelUp && <div onClick={() => setLevelUp(false)} className="absolute inset-0 flex justify-center items-center z-[1] bg-black/60 cursor-pointer">
        <img src="/imgs/game/level-up.png" className="w-60" alt="" />
      </div>}

      {gameOver && <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 z-[1] bg-black/60">
        <img src="/imgs/game/game-over.png" className="w-60" alt="" />
        <div className="flex items-center justify-center gap-2">
          <button onClick={restartGame} className="flex items-center justify-center px-5 py-2 rounded-xl text-white text-lg font-semibold bg-primary cursor-pointer hover:opacity-90 transition-opacity">Restart</button>
          <Link to="/home" className="flex items-center justify-center px-5 py-2 rounded-xl text-white text-lg font-semibold bg-primary cursor-pointer hover:opacity-90 transition-opacity">Go Home</Link>
        </div>
      </div>}
    </div>
  )
}

export default GamePage;