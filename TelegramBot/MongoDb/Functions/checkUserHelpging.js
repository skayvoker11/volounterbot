const User = require('../Model/user');
const bot = require('../../telegramBot')
const keyboard = require('../../Components/keyboard/keyboard')
const helper = require('../../Helper/helper');
const userBan = require('./userBan');
const checkUserHelping = (msg) => {
    User.findOne({ userId: msg.chat.id }).then(async(user, err) => {
        if (err) {
            console.log(err)
        }
        if (user.banByCreateOrder === 0) {
            const time = userBan(user.banDateProcess);
            await helper.sendKeyboard(msg, `Вы забанены за отмену действующего заказа.\nДо конца бана <b>${time}</b> минут.`, keyboard.ban)
        } else {
            if (user.progressOrder) {
                await helper.sendKeyboard(msg, "Ваш заказ взяли, если вы отмените 3 заказа, то попадете в бан.", keyboard.helpingProcess)
            } else {
                if (user.helpgingDescription == null || user.helpgingDescription == "") {
                    await helper.sendKeyboard(msg, "Создайте заказ по гум.помощи", keyboard.helpgin)
                } else if (user.helpgingDescription.length >= 1) {
                    await helper.sendKeyboard(msg, "Хотите изменить заказ ?", keyboard.helpingActive)
                }
            }
        }

    })
}
module.exports = checkUserHelping