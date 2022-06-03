const bot = require('../../telegramBot')
const kb = require('../keyboard/keyboard-buttons')
const keyboard = require('../keyboard/keyboard')
const helper = require('../../Helper/helper')
const mongoose = require('mongoose')
const User = require('../../MongoDb/Model/user')
const checkUserHelping = require('../../MongoDb/Functions/checkUserHelpging')
const userBan = require('../../MongoDb/Functions/userBan')

module.exports = {
    async addHelping(msg) {
        bot.sendMessage(msg.chat.id, "Добавьте список помощи который вам необходим.", {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(async() => {
            await bot.once('message', async(msg) => {
                await User.findOneAndUpdate({ userId: msg.chat.id }, { helpgingDescription: msg.text, helpingFlag: true }).then(async(res, err) => {
                    console.log(res);
                    await bot.sendMessage(msg.chat.id, 'Данные обновлены !', {
                        reply_markup: {
                            keyboard: keyboard.helpingActive
                        }
                    });
                })
            })
        })

    },
    async editOrder(msg) {
        const helpDescription = await User.findOne({ userId: msg.chat.id }).then((result) => {
            bot.sendMessage(msg.chat.id, result.helpgingDescription).then(() => {
                bot.sendMessage(msg.chat.id, "Измените список гум.помощи.", {
                    reply_markup: {
                        remove_keyboard: true
                    }
                }).then(() => {
                    bot.once('message', async(msg) => {
                        let userdb = await User.findOneAndUpdate({ userId: msg.chat.id }, { helpgingDescription: msg.text }).then(() => {
                            bot.sendMessage(msg.chat.id, 'Данные обновлены !', {
                                reply_markup: {
                                    keyboard: keyboard.helpingActive
                                }
                            });
                        })
                    })
                })
            })
        });
    },
    async removeOrder(msg) {
        const helpDescription = await User.findOneAndUpdate({ userId: msg.chat.id }, { helpgingDescription: "", helpingFlag: false }).then((result) => {
            bot.sendMessage(msg.chat.id, "Ваш список гум.помощи удалён", {
                reply_markup: {
                    keyboard: keyboard.helpgin
                }
            })
        });
    },
    async showOrder(msg) {
        const helpDescription = await User.findOne({ userId: msg.chat.id }).then((result) => {
            bot.sendMessage(msg.chat.id, result.helpgingDescription)
        });
    },

    async remvoeProcessOrder(msg) {
        const chatid = msg.chat.id;
        await User.findOneAndUpdate({ userId: chatid }, { progressOrder: false, helpingFlag: true, helpingUser: 0 }).then(async(res, err) => {
            const helpingUser = res.helpingUser;
            if (err) {
                console.log(err)
            } else {
                if (res.banByCreateOrder >= 2) {
                    await User.findOneAndUpdate({ userId: chatid }, { banByCreateOrder: res.banByCreateOrder - 1 })
                }
                if (res.banByCreateOrder == 1) {
                    await User.findOneAndUpdate({ userId: chatid }, { banByCreateOrder: res.banByCreateOrder - 1, banDateProcess: new Date(), helpingFlag: false })
                }
                await User.findOneAndUpdate({ userId: helpingUser }, {
                    $pull: {
                        currentOrders: { userId: chatid }
                    }
                }).then(async(res, err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        await bot.sendMessage(chatid, 'Заказ удалён и отправлен в поиск.').then(async() => {
                            checkUserHelping(msg);
                        });
                        await bot.sendMessage(helpingUser, "Пользователь удалил свой заказ.");

                    }

                })

            }
        })
    },
}