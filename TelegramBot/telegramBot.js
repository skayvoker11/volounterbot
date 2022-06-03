const TelegramBot = require('node-telegram-bot-api');
const token = '5316363825:AAE8wzt9i7fmVUsvOUCE22mjTfnJWU0QpBY';

const bot = new TelegramBot(token, { polling: true });
module.exports = bot;