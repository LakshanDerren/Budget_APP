const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    priority: {
        type: Number, // 1 is highest
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
