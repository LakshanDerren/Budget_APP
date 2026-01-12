const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        default: 'LKR',
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    pocketBalance: {
        type: Number,
        default: 0,
    },
    vaultBalance: {
        type: Number,
        default: 0,
    },
    dailyLimit: {
        type: Number,
        default: 2000,
    },
    spentToday: {
        type: Number,
        default: 0,
    },
    quickAddItems: [
        {
            name: String,
            amount: Number,
            icon: String,
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
