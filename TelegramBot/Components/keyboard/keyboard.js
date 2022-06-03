const kb = require('./keyboard-buttons')
module.exports = {
    home: [
        [kb.home.volunter, kb.home.helpgin],
        [kb.home.profile, kb.home.donate]
    ],
    profile: [
        [kb.profile.location, kb.profile.phoneNumber],
        [kb.profile.changeName],
        [kb.back]
    ],
    profileOrders: [
        [kb.profile.location, kb.profile.phoneNumber],
        [kb.profile.changeName, kb.profile.currentOrders],
        [kb.back]
    ],
    volunter: [
        [kb.volunter.radius1],
        [kb.volunter.radius5],
        [kb.profile.location],
        [kb.back]
    ],
    newUser: [
        [kb.newUser]
    ],
    helpgin: [
        [kb.helpgin.helpingOrder],
        [kb.back]
    ],
    helpingActive: [
        [kb.helpgin.showOrder],
        [kb.helpgin.editOrder],
        [kb.helpgin.removeOrder],
        [kb.back]
    ],
    helpingProcess: [
        [kb.helpgin.removeProccessOrder],
        [kb.back]
    ],
    ban: [
        [kb.back]
    ]
}