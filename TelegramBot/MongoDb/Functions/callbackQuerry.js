const User = require('../Model/user');
const bot = require('../../telegramBot')
const keyboard = require('../../Components/keyboard/keyboard')
const helper = require('../../Helper/helper')
const type = require('../../Components/keyboard/keboard-inline');
const userBan = require('./userBan');
module.exports = {
    async showInfo(msg, messageid) {
        await User.findOne({ userId: msg.uid }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(msg)
                await bot.sendMessage(msg.cuid,
                    `<b>Имя:</b> ${res.name}
<b>Профиль:</b> <a href="tg://user?id=${res.userId}">${res.userName}</a>
<b>Номер телефона:</b>  <a href="tel: ${res.phoneNumber}">${res.phoneNumber}</a>
<b>Адресс:</b> ${res.adress}
<b>Список:</b>\n${res.helpgingDescription}

`, {
                        reply_to_message_id: messageid,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "Взять заказ",
                                    callback_data: JSON.stringify({
                                        type: type.type().ADD_ORDER,
                                        uid: res.userId,
                                        cuid: msg.cuid,
                                    })
                                }]
                            ]
                        }
                    });
            }
        })
    },
    async addOrder(msg, messageid) {
        await User.findOne({ userId: msg.cuid }).then(async(res, err) => {
            if (res.banByOrder === 0) {

                bot.sendMessage(msg.cuid, `Вы не можете взять заказ так как удалили 3 заказа за день.\nДо конца бана <b>${userBan(res.banDate)} минут</b>`, { parse_mode: "HTML" })
            } else {
                await User.findOneAndUpdate({ userId: msg.uid }, { helpingFlag: false, progressOrder: true, helpingUser: msg.cuid }).then(async(res, err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        let count = await User.findOne({ userId: msg.cuid });
                        count = count.currentOrders.length;
                        if (count === 0) {
                            count = 0;
                        } else {
                            count = count + 1;
                        }
                        const date = new Date();
                        const obj = {
                            userId: res.userId,
                            id: count,
                            phoneNumber: res.phoneNumber,
                            userName: res.userName,
                            location: {
                                latitude: res.location.latitude,
                                longitude: res.location.longitude
                            },
                            adress: res.adress,
                            helpgingDescription: res.helpgingDescription,
                            date: date
                        }
                        await User.findOne({ userId: msg.cuid }).then(async(res, err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                let checkIfOrderTrue = false;
                                res.currentOrders.map((el) => {
                                    if (el.userId === msg.uid) {
                                        checkIfOrderTrue = true;
                                    }
                                })
                                if (checkIfOrderTrue) {
                                    bot.sendMessage(msg.cuid, 'Вы уже взяли этот заказ !');
                                } else {
                                    await User.findOneAndUpdate({ userId: msg.cuid }, { $push: { currentOrders: obj } }).then(async(res, err) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            await bot.sendMessage(msg.cuid, `<b>Заказ добавлен!</b>\nДля просмотра заказов зайдите в Профиль->Заказы`, {
                                                reply_to_message_id: messageid,
                                                parse_mode: "HTML",
                                            }).then(async() => {
                                                await bot.sendMessage(msg.uid, `<b>Ваш заказ взяли!</b>\n<b>Имя:</b> ${res.name}\n<b>Профиль:${res.userName}</b>`, {
                                                    reply_to_message_id: messageid,
                                                    parse_mode: "HTML",
                                                })
                                            });
                                        }
                                    })
                                }

                            }
                        })

                    }
                });
            }

        })
    }

}