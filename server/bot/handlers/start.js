const { InlineKeyboard } = require('grammy');
const Bot = require('../index');

const attachStartHandler = () => {
  Bot.command('start', async (ctx) => {
    if (ctx.chat.type !== "private") return;
    const userId = ctx.from.id;

    // await loginUser(
    //     ctx.from.id,
    //     ctx.from.username,
    //     ctx.from.first_name,
    //     ctx.from.last_name,
    //     ctx.from.is_premium,
    //     ctx.from.is_bot,
    //     ctx.match
    // );

    const link = `${process.env.VITE_APP_URL}?startapp=${userId}`;
    const shareText = 'Join our telegram mini app.';
    const invite_fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;

    const keyboard = new InlineKeyboard()
      .webApp('Play Now', process.env.WEBAPP_URL)
      .row()
      .url('Join X', 'https://twitter.com/')
      .url('Join Community', 'https://t.me/')
      .row()
      .url('Visit Website', 'https://babybft.com')
      .url('Invite', invite_fullUrl)

    await ctx.replyWithPhoto(
      process.env.BOT_LOGO,
      {
        caption: 'Welcome to BFT bot!\n\nBaby BFT is a revolutionary cryptocurrency project that combines artificial intelligence with blockchain technology to create immersive gaming experiences, generative NFT tools, and social media interactions in the metaverse.',
        reply_markup: keyboard,
      }
    );
    console.info(`${ctx.from.first_name}#${ctx.from.id} command 'start'`);
  });
}

module.exports = attachStartHandler;