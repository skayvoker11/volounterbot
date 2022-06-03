const bot = require('../telegramBot')
const kb = require('../Components/keyboard/keyboard-buttons')
const keyboard = require('./keyboard/keyboard')
const User = require('../MongoDb/Model/user')

module.exports = {
    saveUserLocation(msg) {
        bot.sendMessage(msg.chat.id, "Отправить локацию", {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{
                        text: kb.location,
                        request_location: true
                    }],
                    [kb.back]
                ]
            }
        }).then(() => {
            bot.once('location', async(result) => {
                let userdb = await User.findOneAndUpdate({ userId: result.chat.id }, { location: result.location }).then(() => {
                    bot.sendMessage(result.chat.id, 'Данные обновлены !', {
                        reply_markup: {
                            keyboard: keyboard.profile
                        }
                    });
                })
            })
        })
    }
}