const bot = require('./TelegramBot/telegramBot')
const keyboard = require('./TelegramBot/Components/keyboard/keyboard')
const kb = require('./TelegramBot/Components/keyboard/keyboard-buttons');
const registration = require('./TelegramBot/Components/Registration/registration-helping');
const mongoDb = require('./TelegramBot/MongoDb/mongodb')
const checkUserAuth = require('./TelegramBot/MongoDb/Functions/checkUserAuth')
const helper = require('./TelegramBot/Helper/helper')
const location = require('./TelegramBot/Components/location');
const phone = require('./TelegramBot/Components/phone')
const addHelping = require('./TelegramBot/Components/Helping/helping')
const checkUserHelping = require('./TelegramBot/MongoDb/Functions/checkUserHelpging')
const finder = require('./TelegramBot/Components/Finder/finder')
const callbackQuerry = require('./TelegramBot/MongoDb/Functions/callbackQuerry');
const keyboard_inline = require('./TelegramBot/Components/keyboard/keboard-inline')
const profile = require('./TelegramBot/Components/Profile/profile')
const checkProfile = require('./TelegramBot/MongoDb/Functions/checkUserProgileOrder');
const User = require('./TelegramBot/MongoDb/Model/user');
const cron = require('./TelegramBot/Cron/cron');
const helping = require('./TelegramBot/Components/Helping/helping');
const { orderComplete } = require('./TelegramBot/Components/Profile/profile');
//connect MongoDb
mongoDb.mongoDb();
//Start option
const payToken = "632593626:TEST:sandbox_i26594133957";
bot.onText(/\/start/, (msg) => {
    checkUserAuth(msg);
});
/*User.find({}).then(async(res) => {
        await res.map(async(el, i) => {
            await User.findOneAndUpdate({ userId: el.userId }, { banByOrder: 3 })
        })
    }) */
//Listen message
bot.on('message', (msg) => {
    const userText = msg.text;
    switch (userText) {
        case kb.home.volunter:
            helper.sendLocation(msg)
            break
        case kb.volunter.radius1:
            finder.searchingRadius(msg, 1);
            break
        case kb.volunter.radius5:
            finder.searchingRadius(msg, 5);
            break
        case kb.newUser:
            registration.registration(msg);
            break
        case kb.home.helpgin:
            checkUserHelping(msg)
            break
        case '/keyboard':
            helper.sendAndDeleteUserMsg(msg, "Клавиатура", keyboard.home)
            break
        case kb.home.profile:
            checkProfile(msg);
            break
        case kb.profile.phoneNumber:
            phone.saveUserPhone(msg);
            break
        case kb.profile.location:
            location.saveUserLocation(msg);
            break
        case kb.profile.changeName:
            profile.changeName(msg);
            break
        case kb.profile.currentOrders:
            profile.showOrders(msg);
            break
        case kb.helpgin.helpingOrder:
            helping.addHelping(msg);
            break
        case kb.helpgin.editOrder:
            helping.editOrder(msg)
            break
        case kb.helpgin.removeProccessOrder:
            helping.remvoeProcessOrder(msg);
            break
        case kb.helpgin.removeOrder:
            helping.removeOrder(msg)
            break
        case kb.helpgin.showOrder:
            helping.showOrder(msg)
            break
        case kb.back:
            checkUserAuth(msg);
            break
        case kb.home.donate:
            var payload = "12345" + Date.now() + "pay"; // you can use your own payload
            var prices = [{
                label: "Donation",
                amount: parseInt("1000") // if you have a decimal price with . instead of ,
            }];
            bot.sendInvoice(msg.from.id, "Донат", "Donation of " + "pay" + "€", payload, payToken, "pay", "UAH", prices); // send invoice button to user
            // remember to save payload and user data in db, it will be useful later
            // usually i save Payload and Status = WAIT           
            break

    }

});
bot.on('callback_query', query => {
    const res = JSON.parse(query.data);
    const chatId = query.message.chat.id;
    const mbid = query.message.message_id

    switch (res.type) {
        case keyboard_inline.type().TYPE_DETATIL:
            callbackQuerry.showInfo(res, mbid);
            break
        case keyboard_inline.type().ADD_ORDER:
            callbackQuerry.addOrder(res)
            break
        case keyboard_inline.type().REMOVE_ORDER:
            profile.removeOrder(res, chatId)
            break
        case keyboard_inline.type().SEND_LOCATION:
            profile.sendLocation(res, chatId)
            break
        case keyboard_inline.type().ORDER_COMPLETE:
            profile.orderComplete(query);
            break
        case keyboard_inline.type().SUCCESS_COMPLETE:
            break
    }

})