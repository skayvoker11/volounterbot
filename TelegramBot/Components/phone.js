const bot = require('../telegramBot')
const kb = require('../Components/keyboard/keyboard-buttons')
const keyboard = require('../Components/keyboard/keyboard')
const User = require('../MongoDb/Model/user')

module.exports = {
    saveUserPhone(msg) {
        bot.sendMessage(msg.chat.id, "Отправить Телефон", {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{
                        text: kb.phone,
                        request_contact: true
                    }],
                    [kb.back]
                ]
            }
        }).then(() => {
            bot.once('contact', async(result) => {
                let userdb = await User.findOneAndUpdate({ userId: result.contact.user_id }, { phoneNumber: result.contact.phone_number }).then(() => {
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