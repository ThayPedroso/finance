require('dotenv').config()

const Transaction = require('../models/transactions')

module.exports = {
    async history (req, res) {

        // Query database for user's transactions
        const userTransactions = await Transaction.find({ user_id: req.user._id })

        res.render('history.ejs', { userTransactions: userTransactions })
    }
}
