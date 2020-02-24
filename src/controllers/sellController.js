require('dotenv').config()

const lookup = require('./lookup')

const User = require('../models/users')
const Transaction = require('../models/transactions')

module.exports = {
    getSell (req, res) {
        res.status(200).render('sell.ejs', { error: undefined, message: undefined })
    }, 
    sell (req, res ) {

        if (!req.body.symbol) {
            res.status(400).render('sell.ejs', { error: 'Must provide symbol', message: undefined })
        }

        if (!req.body.shares){
            res.status(400).render('sell.ejs', { error: 'Must provide shares', message: undefined })
        }

        if (!Number.isInteger(parseInt(req.body.shares))) {
            res.status(400).render('sell.ejs', { error: 'Must provide an integer value', message: undefined })
        }

        if (req.body.shares <= 0){
            res.status(400).render('sell.ejs', { error: 'Must provide a valid shares value', message: undefined })
        }

        // query database for current user shares
        Transaction.aggregate([
            {
                $match: { "user_id": req.user._id, "symbol": req.body.symbol.toUpperCase() }
            },
            { 
                $group: { 
                    _id: "$symbol", 
                    sumShares: { $sum: "$shares" },
                }
            },
        ], 
        async function (err, boughtShares) {

            if (!boughtShares) {
                res.status(400).render('sell.ejs', { error: 'No requested shares available to sell', message: undefined })
            }

            if (boughtShares[0].sumShares < req.body.shares) {
                res.status(400).render('sell.ejs', { error: 'Not enough shares to complete this sell', message: undefined })
            }
            
            // Consult current stock price from API
            const stock = await lookup.lookup(boughtShares[0]._id)
            
            if (!stock) {
                res.status(503).render('sell.ejs', { error: 'Unable to acquire stock current price', message: undefined })
            }
            
            sellTotal = stock.latestPrice * req.body.shares

            const _id = req.user._id

            // Retrieve user cash from database
            const user = await User.findOne({ _id })

            // Update users database to user's cash
            const userUpdated = await User.findByIdAndUpdate( _id, { 
                cash: user.cash + sellTotal, 
            }, { new: true }) // return updated project

            // format new transaction
            const newTransaction = {
                user_id: req.user._id,
                symbol: req.body.symbol,
                shares: req.body.shares * -1,
                totalPrice: sellTotal
            } 

            // Insert transaction
            await Transaction.create(newTransaction)

            res.status(200).render('sell.ejs', { error: undefined, message: 'Sell completed successfully' })
        })
    }
}
