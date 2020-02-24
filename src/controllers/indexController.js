require('dotenv').config()

const lookup = require('./lookup')

const User = require('../models/users')
const Transaction = require('../models/transactions')

module.exports = {
    async index (req, res) {

        const _id = req.user._id

        // query database for user's stocks
        Transaction.aggregate([
            {
                $match: { "user_id": _id }
            },
            { 
                $group: { 
                    _id: "$symbol", 
                    sumShares: { $sum: "$shares" },
                }
            },
        ], 
        async function (err, boughtShares) {

            // Variable to store the sum of all selected shares
            sumSharesCurrentValues = 0

            // Variable to store the sum of share's values plus user's cash
            totalCash = 0

            for (let element of boughtShares) {
                //Consult current stock price from API
                const stock = await lookup.lookup(element._id)
                // Add API information to boughtShares
                element.latestPrice = stock.latestPrice.toFixed(2)
                element.companyName = stock.companyName
                element.total = (stock.latestPrice * element.sumShares).toFixed(2)

                sumSharesCurrentValues += stock.latestPrice * element.sumShares
            }

            // Retrieve user cash from database
            const user = await User.findOne({ _id })

            totalCash = user.cash + sumSharesCurrentValues

            res.status(200).render('index.ejs', { allShares: boughtShares, cash: user.cash.toFixed(2), totalCash: totalCash.toFixed(2) })
        })
    }
}
