const { StatusCodes } = require('http-status-codes');
const { GAME } = require('../config');
const { sendNewHighestScore } = require('../utils/telegram');

const User = require('../models/user.model');
const Game = require('../models/game.model');

const Crypto = require('../utils/crypto');

const startGame = async (req, res) => {
  if (req.user.coin <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'There is no Coin!' });
  }
  req.user.coin -= GAME.COST;
  await req.user.save();

  const game = await Game.create({
    userId: req.user.telegram.id,
  });

  return res.json({ coin: req.user.coin, gameId: game.id });
}

const addPlayedPoint = async (req, res) => {
  const { data } = req.body;

  // Check game result is valid
  const payload = Crypto.decrypt(data);
  if (!payload.gameId) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid game." });

  const game = await Game.findOne({ id: payload.gameId, userId: req.user.telegram.id });
  if (!game) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Game does not exist." });
  if (game.finished) return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Game is finished." });

  game.score = payload.score ?? 0;
  game.finished = true;

  await game.save();

  // const weeklyPlayer = await User.findOne().sort({ 'score.week': -1 }).limit(1);
  // const topPlayer = await User.findOne().sort({ 'score.total': -1 }).limit(1);

  req.user.addScore(payload.score);
  await req.user.save();
  console.log(`${req.user.telegram.firstName} scored ${payload.score} in game.`);

  // if (payload.score > topPlayer.score.total) {
  //   console.log(`${req.user.telegram.firstName} updated total record with ${payload.score}.`);
  //   sendNewHighestScore(req.user.telegram, topPlayer.score.total, payload.score, 0);
  // } else if (payload.score > weeklyPlayer.score.week) {
  //   console.log(`${req.user.telegram.firstName} updated weekly record with ${payload.score}.`);
  //   sendNewHighestScore(req.user.telegram, weeklyPlayer.score.week, payload.score, 2);
  // }

  return res.status(StatusCodes.OK).json({ coin: req.user.coin });
}

module.exports = {
  startGame,
  addPlayedPoint,
};
