const User = require('../Model/user');
const bot = require('../../telegramBot')
const keyboard = require('../../Components/keyboard/keyboard')
const helper = require('../../Helper/helper')
const userBan = (date) => {
    let banMinute = 180
    let minutes = ((new Date()).getTime() - (new Date(date)).getTime()) / 60000;
    return (banMinute - minutes).toFixed(0);
}
module.exports = userBan