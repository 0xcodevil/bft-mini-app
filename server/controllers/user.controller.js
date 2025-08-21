const User = require('../models/user.model');
const Task = require('../models/task.model');

const { LEADERBOARD_SHOW_USER_COUNT } = require('../config');
const { LEADERBOARD_TYPE, TASK_TYPE } = require('../config/constants');

const me = async (req, res) => {
  const user = req.user;
  res.json(user);
}

const getBalance = async (req, res) => {
  res.json({
    coin: req.user.coin,
  });
}

const getAllUserCount = async (_, res) => {
  const userCount = await User.countDocuments();
  res.json({ count: userCount });
};

const getLeaderboard = async (req, res) => {
  const { type } = req.params;
  var users = [];
  var mine = [];
  if (type === LEADERBOARD_TYPE.WEEKLY) {
    users = await User.aggregate([
      { $addFields: { target: '$score.week' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: '$score.week' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  } else if (type === LEADERBOARD_TYPE.MONTHLY) {
    users = await User.aggregate([
      { $addFields: { target: '$score.month' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: '$score.month' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  } else if (type === LEADERBOARD_TYPE.TOTAL) {
    users = await User.aggregate([
      { $addFields: { target: '$score.total' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: '$score.total' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  } else if (type === LEADERBOARD_TYPE.INVITE) {
    users = await User.aggregate([
      { $addFields: { target: { $size: '$friends' } } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: { $size: '$friends' } } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  } else if (type === LEADERBOARD_TYPE.CHECKIN_TOTAL) {
    users = await User.aggregate([
      { $addFields: { target: '$login.total' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: '$login.total' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  } else if (type === LEADERBOARD_TYPE.CHECKIN_STREAK) {
    users = await User.aggregate([
      { $addFields: { target: '$login.maxStreak' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
      { $limit: LEADERBOARD_SHOW_USER_COUNT },
    ]);
    mine = await User.aggregate([
      { $addFields: { target: '$login.maxStreak' } },
      { $setWindowFields: { sortBy: { target: -1 }, output: { rank: { $rank: {} } } } },
      { $match: { _id: req.user._id } },
      { $project: { telegram: 1, ink: 1, target: 1, rank: 1 } },
    ]);
  }
  return res.json({ users, me: mine[0] });
}

const getFriends = async (req, res) => {
  const friends = await User.find({
    _id: { $in: req.user.friends }
  }).select('-_id telegram coin score');

  res.json(friends);
}

const getInviter = async (req, res) => {
  const inviter = await User.findById(req.user.invitedBy).select('telegram');
  res.json(inviter);
}

const info = async (req, res) => {
  let isRegistered = false;

  const { id, inviterId } = req.body;
  const user = await User.findOne({ 'telegram.id': id });
  if (user) isRegistered = true;

  const inviter = await User.findOne({ 'telegram.id': inviterId }).select('telegram');

  const tasks = await Task.aggregate([
    { $match: { type: TASK_TYPE.SOCIAL } },
    { $sample: { size: 1 } }
  ]);

  res.json({
    task: tasks[0],
    isRegistered,
    inviter: inviter?.telegram
  });
}

module.exports = {
  me,
  getBalance,
  getAllUserCount,
  getFriends,
  getInviter,
  getLeaderboard,
  info,
}