const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    active: Boolean,
    name: String,
    lastname: String,
    phoneNumber: String,
    location: Object,
    adress: String,
    helpgingDescription: String,
    helpingFlag: Boolean,
    currentOrders: [Object],
    userName: String,
    progressOrder: Boolean,
    banByOrder: Number,
    banByCreateOrder: Number,
    banDate: Date,
    banDateProcess: Date,
    helpingUser: Number,
    completeOrders: [Object],

}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;