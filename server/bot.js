require('dotenv').config({ path: '../.env' });

const DB = require('./config/db');
const Bot = require('./bot/index');
const attachStartHandler = require('./bot/handlers/start');
const attachChannelHandler = require('./bot/handlers/channel');
const attachPostHandler = require('./bot/handlers/post');
const attachAdminHandler = require('./bot/handlers/admin');
const attachHoldersHandler = require('./bot/handlers/holders');
// const { loginUser } = require('./controllers/auth.controller');

const main = async () => {
    await DB.connect(process.env.MONGO_URL);

    attachStartHandler();
    // attachChannelHandler();
    // attachPostHandler();
    // attachAdminHandler();
    // attachHoldersHandler();

    Bot.api.deleteWebhook().then(() => {
        Bot.start();
        console.info('Game Command Bot started!');
    });
}

main();