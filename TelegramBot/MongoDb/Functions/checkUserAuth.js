const User = require('../Model/user');
const bot = require('../../telegramBot')
const keyboard = require('../../Components/keyboard/keyboard')
const helper = require('../../Helper/helper')
const checkUserAuth = async(msg) => {
    await User.findOne({ userId: msg.chat.id }).then(async(user, err) => {
        if (user == null) {
            await helper.sendAndDeleteUserMsg(msg, "Клавиатура", keyboard.newUser)
            return false
        } else if (user.userId == msg.chat.id) {
            await helper.sendAndDeleteUserMsg(msg, "Клавиатура", keyboard.home)
            return true
        }
        if (err) {
            console.log(err)
        }
    })
}
module.exports = checkUserAuth