const { Bot: TelegramBot, session } = require("grammy");

const Bot = new TelegramBot(process.env.BOT_TOKEN);
const initial = () => {
  return {};
};
Bot.use(session({ initial }));

Bot.catch((err) => {
  console.error(err, "Error in bot:");
  if (err.message.includes("Cannot read properties of null (reading 'items')")) {
    console.log("Detected critical error. Restarting server...");
    // restartServer();
  }
});

module.exports = Bot;