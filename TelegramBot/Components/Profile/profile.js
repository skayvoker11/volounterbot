const bot = require('../../telegramBot')
const kb = require('../keyboard/keyboard-buttons')
const keyboard = require('../keyboard/keyboard')
const helper = require('../../Helper/helper')
const User = require('../../MongoDb/Model/user')
const type = require('../keyboard/keboard-inline')
const checkUserProfile = require('../../MongoDb/Functions/checkUserProgileOrder')
module.exports = {
    async showOrders(msg) {
        User.findOne({ userId: msg.chat.id }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                res.currentOrders.map(async(el, i) => {
                    console.log(el)
                    await bot.sendMessage(msg.chat.id,
                        `
<b>Имя:</b> ${el.name}
<b>Профиль:</b> <a href="tg://user?id=${el.userId}">${el.userName}</a>
<b>Номер телефона:</b>  <a href="tel: ${el.phoneNumber}">${el.phoneNumber}</a>
<b>Адресс:</b> ${el.adress}
<b>Список:</b>\n${el.helpgingDescription}
    `, {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: "Удалить",
                                        callback_data: JSON.stringify({
                                            type: type.type().REMOVE_ORDER,
                                            userHelpId: el.userId
                                        })
                                    }],
                                    [{
                                        text: "Посмотреть локацию",
                                        callback_data: JSON.stringify({
                                            type: type.type().SEND_LOCATION,
                                            userHelpId: el.userId
                                        })
                                    }],
                                    [{
                                        text: "Заказ выполнен",
                                        callback_data: JSON.stringify({
                                            type: type.type().ORDER_COMPLETE,
                                            userHelpId: el.userId
                                        })
                                    }]
                                ]
                            }
                        });
                })

            }
        })
    },
    async removeOrder(msg, chatId) {
        await User.findOneAndUpdate({ userId: chatId }, {
            $pull: {
                currentOrders: { userId: msg.userHelpId }
            }
        }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                if (res.banByOrder >= 2) {
                    await User.findOneAndUpdate({ userId: chatId }, { banByOrder: res.banByOrder - 1 })
                }
                if (res.banByOrder == 1) {
                    await User.findOneAndUpdate({ userId: chatId }, { banByOrder: res.banByOrder - 1, banDate: new Date() })
                }


                await User.findOneAndUpdate({ userId: msg.userHelpId }, { progressOrder: false, helpingFlag: true, helpingUser: 0 }).then(async(res, err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        await bot.sendMessage(chatId, 'Заказ удалён');
                        await bot.sendMessage(msg.userHelpId, "Волонтер удалил ваш заказ, ваш заказ снова отправлен в поиск!");

                    }

                })

            }
        })
    },
    async sendLocation(msg, chatId) {
        console.log(msg)
        User.findOne({ userId: chatId }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                res.currentOrders.map(async(el, i) => {
                    if (el.userId === msg.userHelpId) {
                        console.log(el)
                        await bot.sendLocation(chatId, el.location.latitude, el.location.longitude);
                    }
                })
            }
        })
    },
    async changeName(msg) {
        const chatid = msg.chat.id;

        await User.findOne({ userId: chatid }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                await bot.sendMessage(chatid, `Ваше имя сейчас записано как <b>${res.name}</b>\nВведите новое имя.`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        remove_keyboard: true
                    }
                }).then(async() => {
                    await bot.once("message", async(msg) => {
                        await User.findOneAndUpdate({ userId: chatid }, { name: msg.text }).then(async(res, err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                await bot.sendMessage(chatid, "Данные обновлены !").then(() => {
                                    checkUserProfile(msg);
                                })
                            }
                        })
                    })
                })
            }
        })
    },
    async orderComplete(msg) {
        const data = JSON.parse(msg.data);
        console.log(data)
        await bot.sendMessage(msg.message.chat.id, "Пользователю было отправлено сообщение для потдверждение выполненого заказа");
        await bot.sendMessage(data.userHelpId, "Волонтер выполнил ваш заказ.\nПодтвердите или отмените если это не так.", {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Заказ выполнен",
                        callback_data: JSON.stringify({
                            type: type.type().SUCCESS_COMPLETE,
                            userHelpId: data.userHelpId,
                            volonterId: msg.message.chat.id

                        })
                    }],
                    [{
                        text: "Отменить",
                        callback_data: JSON.stringify({
                            type: type.type().DECLINE_ORDER,
                            userHelpId: data.userHelpId,
                            volonterId: msg.message.chat.id
                        })
                    }],
                ]
            }

        })
    },
    async orderSuccessUser(msg) {
        const data = JSON.parse(msg.data);
        await User.findOneAndUpdate({ userId: data.userHelpId }, { helpingFlag: false, progressOrder: false, helpingUser: 0, helpgingDescription: "" }).then(async() => {
            await User.findByIdAndUpdate({ userId: data.volonterId }, {
                $pull: {
                    currentOrders: { userId: data.userHelpId }
                }
            }).then(async() => {
                await bot.sendMessage(data.volonterId, "Пользователь потвердил выполнение заказа.Спасибо вы делаете огромную услугу Украине!");
                await bot.sendMessage(data.userHelpId, "Вы потдвердили заказ.")
            })
        })
    },
}