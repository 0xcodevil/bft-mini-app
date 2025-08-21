const cron = require("node-cron");
const User = require('./models/user.model');
const RankHistory = require('./models/rank_history.model');
const { fetchTokenTransfer } = require('./utils/wallet');
// const { sendLeaderboard, sendLeaderboardToAdmin } = require("./utils/telegram");

const saveHistory = (users, type) => {
  return RankHistory.create({
    type: type,
    rank: users.map(user => user._id)
  });
}

const resetWeekly = async () => {
  const users = await User.find().sort({ 'score.week': -1 }).limit(10);
  // sendLeaderboard(users, 2);
  // sendLeaderboardToAdmin(users, 2);
  await saveHistory(users, 'weekly');
  await User.updateMany({}, { $set: { 'score.week': 0 } });
  console.log('Weekly score reset.');
}

module.exports.start = () => {
  // cron.schedule('* * * * *', fetchTokenTransfer);
  cron.schedule("0 0 * * MON", resetWeekly);
}