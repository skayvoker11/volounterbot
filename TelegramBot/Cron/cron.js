const cron = require('node-cron');
const userBan = require('../MongoDb/Functions/userBan');
const User = require('../MongoDb/Model/user');
const bot = require('../telegramBot');

cron.schedule("1 * * * * *", () => {
    User.find({ banByOrder: 0 }).then(async(res, err) => {
        res.map(async(el, i) => {
            const time = await userBan(el.banDate);
            if (time <= 0) {
                await User.findOneAndUpdate({ userId: el.userId }, { banByOrder: 3 })
                await bot.sendMessage(el.userId, 'Вас разбанили !')
            }
        })
    })
    User.find({ banByCreateOrder: 0 }).then(async(res, err) => {
        res.map(async(el, i) => {
            const time = await userBan(el.banDateProcess);
            if (time <= 0) {
                await User.findOneAndUpdate({ userId: el.userId }, { banByCreateOrder: 3, helpingFlag: true })
                await bot.sendMessage(el.userId, 'Вас разбанили !')
            }
        })
    })
});