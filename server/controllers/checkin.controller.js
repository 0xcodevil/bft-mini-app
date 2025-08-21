const { StatusCodes } = require('http-status-codes');
const { DAILY_REWARD } = require('../config');
const { TIME, LOG_TYPE } = require('../config/constants');
const Log = require('../models/log.model');

module.exports.claimDailyReward = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if the last check-in was yesterday
    const lastCheckIn = new Date(req.user.login.lastLoginAt || 0).setHours(0, 0, 0, 0);

    const daysDifference = (today - lastCheckIn) / TIME.DAY;

    if (daysDifference === 1) {
      // Consecutive check-in, increase streak
      req.user.login.total += 1;
      req.user.login.streak += 1;
    } else if (daysDifference > 1) {
      // Missed a day, reset streak
      req.user.login.streak = 1;
    } // If `daysDifference === 0`, user has already checked in today

    if (req.user.login.streak > req.user.login.maxStreak) {
      req.user.login.maxStreak = req.user.login.streak;
    }

    if (daysDifference >= 1) {
      // Calculate reward based on streak
      const reward = DAILY_REWARD[(req.user.login.streak - 1) % DAILY_REWARD.length];

      // Update user's last check-in date, streak, and rewards
      req.user.login.lastLoginAt = today;
      req.user.coin += reward.coin;

      await req.user.save();

      await Log.create({
        userId: req.user.telegram.id,
        type: LOG_TYPE.CHECKIN,
        data: {
          streak: req.user.login.streak
        }
      });

      console.log(`${req.user.telegram.firstName} claimed ${req.user.login.streak}st check-in.`);
      return res.json({ msg: `Check-in successful!`, reward });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Already checked in today.' });

  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Oops, something went wrong.' });
  }
};

module.exports.checkDailyReward = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if the last check-in was yesterday
    const lastCheckIn = new Date(req.user.login.lastLoginAt).setHours(0, 0, 0, 0);

    const daysDifference = (today - lastCheckIn) / TIME.DAY;

    if (daysDifference < 1) return res.json({ streak: req.user.login.streak, claimable: false, rewards: DAILY_REWARD });
    else if (daysDifference === 1) return res.json({ streak: req.user.login.streak, claimable: true, rewards: DAILY_REWARD });
    else return res.json({ streak: 0, claimable: true, rewards: DAILY_REWARD });
    
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Oops, something went wrong.' });
  }
};

module.exports.check = async (req, res) => {
  const now = new Date().setHours(0, 0, 0, 0);
  const lastRewardDate = req.user.login.lastLoginAt || new Date(0);

  const timeSinceLastReward = now - lastRewardDate.setHours(0, 0, 0, 0);

  if (timeSinceLastReward >= TIME.DAY) return res.json(true);
  else return res.json(false);
}