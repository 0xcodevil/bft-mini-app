const Bot = require('../index');
const User = require('../../models/user.model');
const { InlineKeyboard } = require('grammy');

const attachAdminHandler = () => {
  Bot.command("admin", async (ctx) => {
    if (ctx.chat.type !== "private") return;
    if (ctx.from.id !== 7343229533) return ctx.reply('You are not admin.');
    const users = await User.find({});

    for (let user of users) {
      const link = `${process.env.VITE_APP_URL}?startapp=${user.telegram.id}`;
      const shareText = 'Join our telegram mini app.';
      const invite_fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
      const keyboard = new InlineKeyboard()
        .webApp('Play Now 🍄🍄🍄', process.env.WEBAPP_URL)
        .row()
        .url('Join X', 'https://twitter.com/shroomyProject')
        .url('Join Community', 'https://t.me/shroomyProject')
        .row()
        .url('Visit Website', 'https://shroomy.io/')
        .url('Invite', invite_fullUrl)

      await Bot.api.sendPhoto(user.telegram.id, process.env.BOT_LOGO, {
        caption: 'Welcome to Shroomy bot!\n\nThe Shroomy Project draws its inspiration from the majestic kingdom of fungi and the paradigm-shifting power of crypto. SHROOMY the token has found its home on the new Ethereum L2 chain Ink, where it seeks to cultivate a thriving community of purpose-driven mushroom lovers.',
        reply_markup: keyboard,
      })
        .then(() => console.log(`Message sent to ${user.telegram.firstName}.`))
        .catch(err => console.error(`Can't send message to ${user.telegram.firstName}: ${err.message}`));
    }
  });
}

module.exports = attachAdminHandler;