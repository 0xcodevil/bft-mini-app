const OpenAI = require('openai');
const Bot = require('../index');
const User = require('../../models/user.model');
const { tt } = require('../../utils/telegram');
const { TIME } = require('../../config/constants');

const REQUIRED_COIN = 0;
const POST_COOLDOWN = TIME.HOUR;

const client = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY
});

const sytemPrompt = `
You are a helpful assistant specializing in fungi facts.
You generate short(should less than 800 letters), interesting, and captivating piece of fact with some description to introduce people to the world of fungi.
You provide a specific example alongside this kind of detail (e.g. naming specific species or where they are found etc).
I want to post this fact to telegram and you can use markdown v2.
Output only post, without explanation about output.
`;

const helpContent = `
I'm the Fungi Fact Generator! 🍄

I can share amazing and interesting facts about the fascinating world of fungi.

🔑 You need at least 1 Coin to request a fact.
💰 Earn Coins through daily rewards and tasks in the mini app: @ShroomyGameBot

Available Commands:
/help@ShroomyGameBot  
/post [Your question about fungi world]
/balance@ShroomyGameBot
`;

const replyMessage = async (ctx, message, parse = false, image = null) => {
  if (image) {
    return ctx.replyWithPhoto(image, {
      caption: message,
      parse_mode: parse ? 'MarkdownV2' : undefined,
      reply_parameters: { message_id: ctx.msg.message_id },
    }).catch(err => console.error('Error while sending image post:', err.message));
  } else {
    return ctx.reply(message, {
      parse_mode: parse ? 'MarkdownV2' : undefined,
      reply_parameters: { message_id: ctx.msg.message_id },
    }).catch(err => console.error('Error while sending post:', err.message));
  }
}

var isBusy = false;
var previousOutput = '';

const attachPostHandler = () => {
  Bot.command('help@ShroomyGameBot', async (ctx) => {
    ctx.reply(helpContent);
  });

  Bot.command('balance@ShroomyGameBot', async (ctx) => {
    const user = await User.findOne({ 'telegram.id': ctx.from.id.toString() });
    if (!user) return replyMessage(ctx, 'Please register for the mini app and earn Coins. DM me to get started: @ShroomyGameBot');

    replyMessage(ctx, `💎 ${ctx.from.first_name}! You have ${user.coin} Coin${user.coin > 1 ? 's' : ''}`);
  });

  Bot.command('post', async (ctx) => {
    try {
      if (isBusy) return replyMessage(ctx, '⏲ I\'m busy right now. Please try again in a few minutes.');
      isBusy = true;

      const user = await User.findOne({ 'telegram.id': ctx.from.id.toString() });
      if (!user) return replyMessage(ctx, '🍄 Please register for the mini app and earn Coins to use this feature. DM me to get started: @ShroomyGameBot');

      if (user.coin < REQUIRED_COIN) return replyMessage(ctx, '⚠️ You need at least 10 Coins to generate a fungi fact. Start the mini app and earn Coins now! @ShroomyGameBot\nYour balance: /balance@ShroomyGameBot');

      const now = Date.now();
      const lastPostAt = user.post.lastPostAt ?? 0;

      if (now - lastPostAt < POST_COOLDOWN) return replyMessage(ctx, '⏳ Please wait for the cooldown and try again. You can generate a fact only once every 1 hour.');

      const userPrompt = ctx.message.text.split('/post ')[1]?.trim();
      if (!userPrompt) return replyMessage(ctx, '⚠️ Please provide an input prompt.');

      console.log(`Post request from ${ctx.from.first_name}:`, userPrompt);

      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: sytemPrompt },
          { role: "assistant", content: previousOutput },
          { role: "user", content: userPrompt },
        ],
        model: "gpt-4o-mini",
        presence_penalty: 1.0,
        temperature: 0.8,
      });

      if (completion?.choices?.length && completion.choices[0]?.message?.content) {
        user.coin -= REQUIRED_COIN;
        user.post.lastPostAt = now;
        user.post.count++;
        await user.save();
        previousOutput = completion.choices[0].message.content;
        const result = tt(completion.choices[0].message.content);

        try {
          const response = await client.images.generate({
            model: "dall-e-3",
            prompt: completion.choices[0].message.content,
            n: 1,
            size: "1024x1024",
          });
          replyMessage(ctx, result, true, response.data[0].url);
        } catch (err) {
          console.log('Image generation failed:', err.message);
          replyMessage(ctx, result, true);
        }
      }
      else {
        console.error(completion);
        replyMessage(ctx, '☹️ Failed to generate!');
      }
    } catch (err) {
      console.error('Error while generating AI post:', err.message);
      replyMessage(ctx, '😬 I\'m broken!');
    } finally {
      isBusy = false;
    }
  });
}

module.exports = attachPostHandler;