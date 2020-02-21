const mongoose = require('../database')

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
    },
    shares: {
        type: Number,
        require: true,
    },
    totalPrice: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction