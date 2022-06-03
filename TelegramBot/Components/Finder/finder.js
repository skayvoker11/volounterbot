const bot = require('../../telegramBot')
const kb = require('../keyboard/keyboard-buttons')
const keyboard = require('../keyboard/keyboard')
const helper = require('../../Helper/helper')
const mongoose = require('mongoose')
const User = require('../../MongoDb/Model/user')
const funcRadius = require('../../coordianteFunction')
const type = require('../keyboard/keboard-inline')
const { json } = require('express/lib/response')
module.exports = {
    async searchingRadius(msg) {
        await User.findOne({ userId: msg.chat.id }).then(async(res, err) => {
            if (err) {
                console.log(err)
            } else {
                const currentLoc = res.location;
                await User.find({ helpingFlag: true }).then((res, err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.map(async(user, i) => {
                            if (msg.chat.id != user.userId) {

                                const radius = funcRadius.mathRad(currentLoc.latitude, currentLoc.longitude, user.location.latitude, user.location.longitude)
                                await bot.sendVenue(msg.chat.id, user.location.latitude, user.location.longitude,
                                    `До точки ${radius}км`,
                                    ``, {
                                        reply_markup: {
                                            inline_keyboard: [
                                                [{
                                                    text: "Подробнее",
                                                    callback_data: JSON.stringify({
                                                        type: type.type().TYPE_DETATIL,
                                                        uid: user.userId,
                                                        cuid: msg.chat.id,
                                                    })
                                                }]
                                            ]
                                        }
                                    })
                            }
                        });
                    }
                })
            }

        })

    }
}