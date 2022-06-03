const bot = require('../telegramBot')
const kb = require('../Components/keyboard/keyboard-buttons')
const keyboard = require('../Components/keyboard/keyboard')
const User = require('../MongoDb/Model/user')
module.exports = {
    sendAndDeleteUserMsg(msg, text, keyboard) {
        bot.sendMessage(msg.chat.id, text, {
            reply_markup: {
                keyboard: keyboard
            }
        }).then((result) => {
            bot.deleteMessage(msg.chat.id, result.message_id - 1)
        })
    },
    sendKeyboard(msg, text, keyboard) {
        bot.sendMessage(msg.chat.id, text, {
            reply_markup: {
                keyboard: keyboard
            },
            parse_mode: "HTML"
        })
    },
    async sendLocation(msg) {
        const userLoc = await User.findOne({ userId: msg.chat.id }).then(async(user) => {
            await bot.sendVenue(msg.chat.id, user.location.latitude, user.location.longitude, "Вы находитесь здесь", "Выберите радиус поиска для помощи", {
                reply_markup: {
                    keyboard: keyboard.volunter
                }
            })
        })

    },

}