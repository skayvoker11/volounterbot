const bot = require('../../telegramBot')
const kb = require('../keyboard/keyboard-buttons')
const keyboard = require('../keyboard/keyboard')
const helper = require('../../Helper/helper')
const User = require('../../MongoDb/Model/user')
module.exports = {
    async registration(msg) {
        const propsSaveUser = {
            userId: 0,
            active: true,
            name: '',
            lastname: '',
            phoneNumber: 0,
            location: {},
            adress: '',
            helpgingDescription: '',
            helpingFlag: false,
            currentOrders: [],
            userName: '',
            progressOrder: false,
            banByOrder: 3,
            banByCreateOrder: 3,
            deleteOrderHelping: {},
            deleteOrderVolonter: {},
            completeOrders: []

        }
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, "Пройдите регистрацию ", {
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
        }).then(async() => {
            await bot.once('contact', async(msg) => {
                //contact
                propsSaveUser.userId = msg.contact.user_id;
                propsSaveUser.name = msg.contact.first_name;
                propsSaveUser.phoneNumber = msg.contact.phone_number;
                await bot.sendMessage(chatId, 'Поделитесь локаций', {
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
                }).then(async() => {
                    //location
                    await bot.once("location", async(msg) => {
                        propsSaveUser.location = msg.location;
                        console.log(propsSaveUser)
                        await bot.sendMessage(chatId, 'Напишите свой адресс одной строчкой. Пример: Улица Рыбалко. Дом 89.Подьезд 1', {
                                reply_markup: {
                                    remove_keyboard: true
                                }
                            })
                            .then(async() => {
                                await bot.once('message', async(msg) => {
                                    propsSaveUser.adress = msg.text;
                                    propsSaveUser.userName = `@${msg.chat.username}`
                                    await User.findOne({ userId: msg.chat.id }).then(async(res, err) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            const user = await new User(propsSaveUser).save().then(async() => {
                                                await bot.sendMessage(msg.chat.id, 'Спасибо за регистрацию', {
                                                    reply_markup: {
                                                        keyboard: keyboard.home
                                                    }
                                                })
                                            });
                                        }
                                    })

                                })
                            })
                    })
                })
            })
        })
    }
}