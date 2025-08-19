const mongoose = require('mongoose');
const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const Task = require('../models/task.model');
const Game = require('../models/game.model');
const Log = require('../models/log.model');
const RankHistory = require('../models/rank_history.model');
const { TASK_TYPE, TASK_SUB_TYPE, LOG_TYPE, TIME, TAP_RANKING_TYPE } = require('../config/constants');

const getSocialTasks = async (req, res) => {
  const tasks = await Task.find({ type: TASK_TYPE.SOCIAL }).select('-__v').sort({ $natural: -1 }).lean();
  tasks.forEach((task, key) => {
    const userTask = req.user.tasks.find(t => task._id.equals(t.taskId));
    if (userTask) {
      tasks[key].isCompleted = true;
      tasks[key].isClaimed = userTask.isClaimed;
    } else {
      tasks[key].isCompleted = false;
    }
  });
  return res.json(tasks);
}

const visitSocialTask = async (req, res) => {
  const { taskId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid task id.' });

  const task = await Task.findById(taskId);
  if (!(task && task.type === TASK_TYPE.SOCIAL)) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not found.' });

  const userTask = req.user.tasks.find((ut) => ut.taskId.equals(task._id));

  if (userTask) return res.status(StatusCodes.TOO_MANY_REQUESTS).json({ msg: 'Already done.' });
  req.user.tasks.push({ taskId });
  await req.user.save();

  return res.json({ success: true });
};

const claimSocialTask = async (req, res) => {
  const { taskId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid task id.' });

  const task = await Task.findById(taskId);
  if (!(task && task.type === TASK_TYPE.SOCIAL)) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not found.' });

  const userTask = req.user.tasks.find((ut) => ut.taskId.equals(task._id));

  if (userTask) {
    if (userTask.isClaimed) return res.status(StatusCodes.CONFLICT).json({ msg: 'Already done.' });
    userTask.isClaimed = true;
    if (task.reward.coin > 0) req.user.coin += task.reward.coin;
    await req.user.save();
  } else return res.status(StatusCodes.FORBIDDEN).json({ msg: 'Please complete task.' });

  return res.json({ msg: 'Task completed.', coin: req.user.coin });
}

const getDailyTasks = async (req, res) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  const tasks = await Task.find({ type: TASK_TYPE.DAILY }).select('-__v').sort({ target: 1 }).lean();
  tasks.forEach((task) => {
    task.isClaimed = req.user.tasks.some(t => task._id.equals(t.taskId) && t.completedAt >= startOfToday && t.completedAt < startOfTomorrow);
  });

  const group = _.groupBy(tasks, task => task.group);

  const spinCount = await Spin.countDocuments({
    userId: req.user.telegram.id,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const tapCount = await Game.countDocuments({
    userId: req.user.telegram.id,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const harvestCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.HARVEST,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const winCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.WIN_DEFENSE,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const inviteCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.INVITE,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });

  group[TASK_SUB_TYPE.SPIN].forEach(t => {
    t.current = spinCount;
    t.isCompleted = t.current >= t.target;
  });
  group[TASK_SUB_TYPE.TAP].forEach(t => {
    t.current = tapCount;
    t.isCompleted = t.current >= t.target;
  });
  group[TASK_SUB_TYPE.FARM].forEach(t => {
    t.current = harvestCount;
    t.isCompleted = t.current >= t.target;
  });
  group[TASK_SUB_TYPE.DEFENSE].forEach(t => {
    t.current = winCount;
    t.isCompleted = t.current >= t.target;
  });
  group[TASK_SUB_TYPE.INVITE].forEach(t => {
    t.current = inviteCount;
    t.isCompleted = t.current >= t.target;
  });
  group[TASK_SUB_TYPE.ALL][0].isCompleted = (
    _.every(group[TASK_SUB_TYPE.SPIN], { isCompleted: true }) &&
    _.every(group[TASK_SUB_TYPE.TAP], { isCompleted: true }) &&
    _.every(group[TASK_SUB_TYPE.FARM], { isCompleted: true }) &&
    _.every(group[TASK_SUB_TYPE.DEFENSE], { isCompleted: true }) &&
    _.every(group[TASK_SUB_TYPE.INVITE], { isCompleted: true })
  );

  return res.json({ tasks: group, cooldown: startOfTomorrow - now });
}

const claimDailyTask = async (req, res) => {
  const { id } = req.body;
  const task = await Task.findOne({ _id: id, type: TASK_TYPE.DAILY });
  if (!task) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not found.' });

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  const isClaimed = req.user.tasks.some((ut) => ut.taskId.equals(id) && ut.completedAt >= startOfToday && ut.completedAt < startOfTomorrow);
  if (isClaimed) return res.status(StatusCodes.CONFLICT).json({ msg: 'Already done.' });

  const spinCount = await Spin.countDocuments({
    userId: req.user.telegram.id,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const tapCount = await Game.countDocuments({
    userId: req.user.telegram.id,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const harvestCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.HARVEST,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const winCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.WIN_DEFENSE,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });
  const inviteCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.INVITE,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });

  if (task.group === TASK_SUB_TYPE.SPIN && task.target > spinCount) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  if (task.group === TASK_SUB_TYPE.TAP && task.target > tapCount) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  if (task.group === TASK_SUB_TYPE.FARM && task.target > harvestCount) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  if (task.group === TASK_SUB_TYPE.DEFENSE && task.target > winCount) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  if (task.group === TASK_SUB_TYPE.INVITE && task.target > inviteCount) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  if (task.group === TASK_SUB_TYPE.ALL) {
    const dailyTasks = await Task.find({ type: TASK_TYPE.DAILY, group: { $ne: TASK_SUB_TYPE.ALL } }).lean();
    const isDone = dailyTasks.reduce((prev, curr) => {
      let done = true;
      if (curr.group === TASK_SUB_TYPE.SPIN) done = spinCount >= curr.target;
      if (curr.group === TASK_SUB_TYPE.SPIN) done = tapCount >= curr.target;
      if (curr.group === TASK_SUB_TYPE.SPIN) done = harvestCount >= curr.target;
      if (curr.group === TASK_SUB_TYPE.SPIN) done = winCount >= curr.target;
      if (curr.group === TASK_SUB_TYPE.SPIN) done = inviteCount >= curr.target;
      return prev && curr;
    }, true);
    if (isDone) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }

  req.user.tasks.push({ taskId: id, isClaimed: true });
  await req.user.save();

  return res.json({ success: true });
}

const getWeeklyTasks = async (req, res) => {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const tasks = await Task.find({ type: TASK_TYPE.WEEKLY }).select('-__v').lean();
  tasks.forEach((task) => {
    task.isClaimed = req.user.tasks.some(t => task._id.equals(t.taskId) && t.completedAt >= startOfWeek);
  });

  const group = tasks.reduce((acc, task) => {
    acc[task.group] = task;
    return acc;
  }, {});

  const transcended = req.user.defense.transcendedAt > startOfWeek;
  const checkInCount = await Log.countDocuments({
    userId: req.user.telegram.id,
    type: LOG_TYPE.CHECKIN,
    createdAt: { $gte: startOfWeek }
  });
  const rankings = await RankHistory.findOne({
    type: TAP_RANKING_TYPE.WEEKLY,
    createdAt: { $gte: startOfWeek }
  });
  const rank = rankings ? (rankings.rank.findIndex(r => r.equals(req.user._id)) + 1) : 0;

  group[TASK_SUB_TYPE.TRANSCEND].target = 1;
  group[TASK_SUB_TYPE.TRANSCEND].current = transcended ? 1 : 0;
  group[TASK_SUB_TYPE.TRANSCEND].isCompleted = transcended;
  group[TASK_SUB_TYPE.CHECKIN].current = checkInCount;
  group[TASK_SUB_TYPE.CHECKIN].isCompleted = checkInCount >= 7;
  group[TASK_SUB_TYPE.MAESTRO].isCompleted = rank > 3 && rank < 11;
  group[TASK_SUB_TYPE.CHAMPION].isCompleted = rank === 2 && rank === 3;
  group[TASK_SUB_TYPE.LEGEND].isCompleted = rank === 1;

  return res.json({ tasks: Object.values(group), cooldown: startOfWeek - now + TIME.WEEK });
}

const claimWeeklyTask = async (req, res) => {
  const { id } = req.body;
  const task = await Task.findOne({ _id: id, type: TASK_TYPE.WEEKLY });
  if (!task) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not found.' });

  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const isClaimed = req.user.tasks.some((ut) => ut.taskId.equals(id) && ut.completedAt >= startOfWeek);
  if (isClaimed) return res.status(StatusCodes.CONFLICT).json({ msg: 'Already done.' });

  if (task.group === TASK_SUB_TYPE.TRANSCEND) {
    const transcended = req.user.defense.transcendedAt > startOfWeek;
    if (!transcended) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }
  if (task.group === TASK_SUB_TYPE.CHECKIN) {
    const checkInCount = await Log.countDocuments({
      userId: req.user.telegram.id,
      type: LOG_TYPE.CHECKIN,
      createdAt: { $gte: startOfWeek }
    });
    if (checkInCount < 7) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }
  const rankings = await RankHistory.findOne({
    type: TAP_RANKING_TYPE.WEEKLY,
    createdAt: { $gte: startOfWeek }
  });
  const rank = rankings ? (rankings.rank.findIndex(r => r.equals(req.user._id)) + 1) : 0;
  if (task.group === TASK_SUB_TYPE.MAESTRO) {
    if (rank < 4 || rank > 10) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }
  if (task.group === TASK_SUB_TYPE.CHAMPION) {
    if (rank !== 2 || rank !== 3) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }
  if (task.group === TASK_SUB_TYPE.LEGEND) {
    if (rank !== 1) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });
  }

  req.user.tasks.push({ taskId: id, isClaimed: true });
  await req.user.save();

  return res.json({ success: true });
}

const getInviteTask = async (req, res) => {
  const tasks = await Task.find({ type: TASK_TYPE.INVITE }).select('-__v').lean();
  tasks.forEach((task) => {
    task.current = req.user.friends.length
    task.isCompleted = task.current >= task.target;
    task.isClaimed = req.user.tasks.some(t => task._id.equals(t.taskId));
  });
  return res.json(tasks);
}

const claimInviteTask = async (req, res) => {
  const { id } = req.body;
  const task = await Task.findOne({ _id: id, type: TASK_TYPE.INVITE });
  if (!task) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not found.' });

  const userTask = req.user.tasks.find((ut) => ut.taskId.equals(task._id));
  if (userTask?.isClaimed) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Already claimed.' });

  if (req.user.friends.length < task.target) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Task is not completed.' });

  req.user.tasks.push({ taskId: id, isClaimed: true });
  req.user.coin += task.reward.coin;
  await req.user.save();

  return res.json({ success: true });
}

module.exports = {
  getSocialTasks,
  visitSocialTask,
  claimSocialTask,
  getDailyTasks,
  claimDailyTask,
  getWeeklyTasks,
  claimWeeklyTask,
  getInviteTask,
  claimInviteTask,
};