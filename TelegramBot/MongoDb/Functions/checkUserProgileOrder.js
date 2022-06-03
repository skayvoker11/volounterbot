const User = require('../Model/user');
const bot = require('../../telegramBot')
const keyboard = require('../../Components/keyboard/keyboard')
const helper = require('../../Helper/helper')
const checkUserProfile = (msg) => {
    User.findOne({ userId: msg.chat.id }).then(async(user, err) => {
        if (user.currentOrders.length >= 1) {
            await helper.sendKeyboard(msg, "Профиль", keyboard.profileOrders)
        } else {
            await helper.sendKeyboard(msg, "Клавиатура", keyboard.profile)
        }
        if (err) {
            console.log(err)
        }
    })
}
module.exports = checkUserProfile