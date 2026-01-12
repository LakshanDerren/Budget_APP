const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['expense', 'deposit'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    wallet: {
        type: String,
        enum: ['pocket', 'vault'],
        required: true,
    },
    note: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
