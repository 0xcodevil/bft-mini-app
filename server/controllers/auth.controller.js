const { StatusCodes } = require("http-status-codes");
const { validate, parse } = require('@telegram-apps/init-data-node');
const User = require("../models/user.model");
const Log = require("../models/log.model");
const { BONUS } = require("../config");
const { LOG_TYPE } = require("../config/constants");
const JWT = require("../utils/jwt");
const { sendMessage } = require('../utils/telegram');

const loginUser = async (id, username, firstName, lastName, isPremium, isBot, photoUrl, inviterId) => {
  // downloadAvatar(id);

  var user = await User.findOne({ 'telegram.id': id });

  if (user) {
    user.telegram = { id, username, firstName, lastName, isPremium, isBot, photoUrl };
    await user.save().then(() => console.log(`${firstName} logged in.`));
  } else {
    try {
      user = new User({ telegram: { id, username, firstName, lastName, isPremium, photoUrl, isBot } });
      user.coin += BONUS.SIGN_UP;
      await user.save();
      console.log(`${firstName} registered.`);

      if (inviterId && inviterId !== id) {
        const inviter = await User.findOne({ 'telegram.id': inviterId });
        if (inviter && !inviter.friends.includes(user._id)) {
          inviter.friends.push(user._id);
          inviter.coin += BONUS.INVITE_FRIEND;
          await inviter.save().then(() => console.log(`${inviter.telegram.firstName} received invite bonus.`));
          sendMessage(inviter.telegram.id, `${user.telegram.firstName} accepted your invite.\nYou received ${BONUS.INVITE_FRIEND} Coins.`);

          user.invitedBy = inviter._id;
          await user.save().then(() => console.log(`${user.telegram.firstName} received invited bonus.`));
          sendMessage(user.telegram.id, `You accepted ${inviter.telegram.firstName}'s invite.`);

          await Log.create({
            userId: inviter.telegram.id,
            type: LOG_TYPE.INVITE,
            data: {
              inviteId: user.telegram.id
            }
          });
        }
      }
    } catch (err) {
      console.error(`Sign up failed: ${err.message}`);
    }
  }
}

const login = async (req, res) => {
  const { data, inviterId } = req.body;
  const tokenDuration = 6 * 3600;

  try {
    validate(data, process.env.BOT_TOKEN, { expiresIn: tokenDuration });
  } catch (err) {
    console.error('Auth:', err.name);
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: err.name });
  }
  const { user } = parse(data);
  if (!user) {
    console.error('Auth:', 'Telegram user not found.');
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Telegram user not found.' });
  }

  await loginUser(user.id, user.username, user.first_name, user.last_name, user.is_premium, user.is_bot, user.photo_url, inviterId);

  const token = JWT.generate({ telegramId: user.id });
  res.cookie('access_token', token, { httpOnly: true, maxAge: tokenDuration * 1000 }).json({ msg: "OK" });
};

const logout = async (req, res) => {
  res.clearCookie('access_token').json({ message: "Logged out." });
};

module.exports = { login, logout, loginUser };