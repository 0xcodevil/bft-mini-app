const Bot = require('../index');

const attachChannelHandler = () => {
  Bot.command("channel", async (ctx) => {
    if (ctx.chat.type !== "private") return;
    const chatId = ctx.message.text.split(' ')[1];
    if (!chatId) return ctx.reply('Please input correct channel id.');
    Bot.api.getChatMember(chatId, Bot.botInfo.id).then(member => {
      ctx.reply(member.status);
    }).catch(err => {
      ctx.reply(err.message);
    });
  });
}

module.exports = attachChannelHandler;