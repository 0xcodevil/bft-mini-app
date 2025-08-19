const fs = require('fs');
const path = require('path');
const download = require('download');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN);

const tt = (text) => {
    return text
        .replace(/\_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\~/g, '\\~')
        .replace(/\`/g, '\\`')
        .replace(/\>/g, '\\>')
        .replace(/\#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/\-/g, '\\-')
        .replace(/\=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/\!/g, '\\!');
}

const createInvoiceLink = async (title, description, payload, price) => {
    const currency = "XTR";
    const prices = [{ amount: price, label: title }];

    const invoiceLink = await bot.createInvoiceLink(
        title,
        description,
        payload,
        "", // Provider token must be empty for Telegram Stars
        currency,
        prices,
    );
    return invoiceLink;
}

const sendMessage = (userId, message) => {
    bot.sendMessage(userId, message).catch(err => console.error(`Error sending message: ${err.message}`));
}

const sendNewHighestScore = (user, lastScore, newScore, type) => {
    const title = [
        '👑 *All\\-Time Legend\\!*',
        '🏆 *Monthly Champion\\!*',
        '🥇 *Weekly Maestro\\!*',
    ];
    const image = [
        'https://ibb.co/9kVcdMBG',
        'https://ibb.co/B2qnrMsX',
        'https://ibb.co/jZJzrNhk',
    ]
    const message = `${title[type]}\n\nNew record:\n> ~${lastScore}~ *${newScore}*\n*${tt(user.username ? '@' + user.username : user.firstName)}* is the new champion\\!\nJoin and break his record: [@ShroomyGameBot](${tt(process.env.VITE_APP_URL)})`;
    bot.sendPhoto(process.env.TELEGRAM_GROUP_ID, image[type], {
        caption: message,
        parse_mode: 'MarkdownV2',
        reply_markup: {
            inline_keyboard: [[{ text: '🍄 Challenge Now 🍄', url: process.env.VITE_APP_URL }]]
        }
    }).catch(err => console.error(`Error sending new high score: ${err.message}`));
}

const sendLeaderboard = (users, type) => {
    const title = [
        '👑 *All\\-Time Legend\\!*',
        '🏆 *Monthly Champion\\!*',
        '🥇 *Weekly Maestro\\!*',
    ];
    const image = [
        'https://ibb.co/9kVcdMBG',
        'https://ibb.co/B2qnrMsX',
        'https://ibb.co/jZJzrNhk',
    ]
    var message = `${title[type]} ${tt(users[0].telegram.username ? '@' + users[0].telegram.username : users[0].telegram.firstName)}\n\n`;
    users.forEach((user, key) => {
        let rank;
        if (key === 0) rank = '🥇 ';
        else if (key === 1) rank = '🥈 ';
        else if (key === 2) rank = '🥉 ';
        else rank = '  ' + (key + 1) + '\\.  ';
        let username = user.telegram.username ? '@' + user.telegram.username : user.telegram.firstName;
        let score = [
            user.score.total,
            user.score.month,
            user.score.week,
        ];
        message += `${rank} ${tt(username)} ${score[type]}\n`;
    });
    bot.sendPhoto(process.env.TELEGRAM_GROUP_ID, image[type], {
        caption: message,
        parse_mode: 'MarkdownV2'
    }).catch(err => console.error(`Error sending leaderboard: ${err.message}`));
}

const sendLeaderboardToAdmin = (users, type) => {
    const title = [
        '👑 *All\\-Time Legend\\!*',
        '🏆 *Monthly Champion\\!*',
        '🥇 *Weekly Maestro\\!*',
    ];
    const image = [
        'https://ibb.co/9kVcdMBG',
        'https://ibb.co/B2qnrMsX',
        'https://ibb.co/jZJzrNhk',
    ]
    var message = `${title[type]} ${tt(users[0].telegram.username ? '@' + users[0].telegram.username : users[0].telegram.firstName)}\n\n`;
    users.forEach((user, key) => {
        let rank;
        if (key === 0) rank = '🥇 ';
        else if (key === 1) rank = '🥈 ';
        else if (key === 2) rank = '🥉 ';
        else rank = '  ' + (key + 1) + '\\.  ';
        let username = user.telegram.username ? '@' + user.telegram.username : user.telegram.firstName;
        let score = [
            user.score.total,
            user.score.month,
            user.score.week,
        ];
        let wallet = '';
        if (user.ink.wallet) {
            wallet += `\n\`${user.ink.wallet}\``;
            if (!user.ink.verified) wallet += ' \\(Unverified\\)'
        }
        message += `${rank} ${tt(username)} ${score[type]}${wallet}\n`;
    });
    bot.sendPhoto(process.env.TELEGRAM_ADMIN_ID, image[type], {
        caption: message,
        parse_mode: 'MarkdownV2'
    }).catch(err => console.error(`Error sending leaderboard: ${err.message}`));
}

const sendFarmLeaderboard = (users, toAdmin) => {
    const title = '👑 *Shroomy Farming Champion*';
    const image = 'https://ibb.co/fYk71Dfc';
    var message = `${title} ${tt(users[0].telegram.username ? '@' + users[0].telegram.username : users[0].telegram.firstName)}\n\n`;
    users.forEach((user, key) => {
        let rank;
        if (key === 0) rank = '🥇 ';
        else if (key === 1) rank = '🥈 ';
        else if (key === 2) rank = '🥉 ';
        else rank = '  ' + (key + 1) + '\\.  ';
        let username = user.telegram.username ? '@' + user.telegram.username : user.telegram.firstName;
        let wallet = '';
        if (toAdmin && user.ink.wallet) {
            wallet += `\n\`${user.ink.wallet}\``;
            if (!user.ink.verified) wallet += ' \\(Unverified\\)'
        }
        message += `${rank} ${tt(username)} ${user.farm.claimedAmount}${wallet}\n`;
    });
    bot.sendPhoto(
        toAdmin ? process.env.TELEGRAM_ADMIN_ID : process.env.TELEGRAM_GROUP_ID,
        image,
        {
            caption: message,
            parse_mode: 'MarkdownV2'
        }
    ).catch(err => console.error(`Error sending leaderboard: ${err.message}`));
}

const sendDefenseLeaderboard = (users, toAdmin) => {
    const title = '👑 *Shroomy Defense Champion*';
    const image = 'https://ibb.co/LzRqkDSJ';
    var message = `${title} ${tt(users[0].telegram.username ? '@' + users[0].telegram.username : users[0].telegram.firstName)}\n\n`;
    users.forEach((user, key) => {
        let rank;
        if (key === 0) rank = '🥇 ';
        else if (key === 1) rank = '🥈 ';
        else if (key === 2) rank = '🥉 ';
        else rank = '  ' + (key + 1) + '\\.  ';
        let username = user.telegram.username ? '@' + user.telegram.username : user.telegram.firstName;
        let wallet = '';
        if (toAdmin && user.ink.wallet) {
            wallet += `\n\`${user.ink.wallet}\``;
            if (!user.ink.verified) wallet += ' \\(Unverified\\)'
        }
        message += `${rank} ${tt(username)} Round ${user.defense.level}${wallet}\n`;
    });
    bot.sendPhoto(
        toAdmin ? process.env.TELEGRAM_ADMIN_ID : process.env.TELEGRAM_GROUP_ID,
        image,
        {
            caption: message,
            parse_mode: 'MarkdownV2'
        }
    ).catch(err => console.error(`Error sending leaderboard: ${err.message}`));
}

const sendInsufficientWaterMessage = (user) => {
    var message = `Your Shroomies are on the brink of dying due to lack of water! 💧\nHurry up and water them now!`;
    bot.sendPhoto(user.telegram.id, 'https://ibb.co/DD8w0q6N', {
        caption: message,
        reply_markup: {
            inline_keyboard: [[{ text: 'Water Now 💧💧💧', web_app: { url: process.env.WEBAPP_URL } }]]
        }
    }).catch(err => console.error(`Error sending water alert: ${err.message}`));
}

const sendHarvestMessage = (user) => {
    var message = `Your Shroomies are ready to harvest!🍄\nHarvest them before they wither and earn a new badge! 🎖️`;
    bot.sendPhoto(user.telegram.id, 'https://ibb.co/C3mwrTfP', {
        caption: message,
        reply_markup: {
            inline_keyboard: [[{ text: 'Harvest Now 🍄🍄🍄', web_app: { url: process.env.WEBAPP_URL } }]]
        }
    }).catch(err => console.error(`Error sending harvest message: ${err.message}`));
}

const downloadAvatar = async (userId) => {
    try {
        const url = path.join(__dirname, '..', 'uploads/avatars', userId + '.jpg');
        const isExist = fs.existsSync(url);
        if (isExist) return console.info('Avatar exist.');
        const userProfilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });
        if (userProfilePhotos.total_count > 0) {
            const fileId = userProfilePhotos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            const downloadUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
            await download(downloadUrl).pipe(fs.createWriteStream(`uploads/avatars/${userId}.jpg`));
            console.info(`Avatar downloaded for ${userId}.`);
        }
    } catch (err) {
        console.error('Avatar download failed:', err.message);
    }
}

module.exports = {
    tt,
    createInvoiceLink,
    sendMessage,
    sendNewHighestScore,
    sendLeaderboard,
    sendLeaderboardToAdmin,
    sendFarmLeaderboard,
    sendDefenseLeaderboard,
    sendInsufficientWaterMessage,
    sendHarvestMessage,
    downloadAvatar
}