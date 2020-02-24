require('dotenv').config()

const lookup = require('./lookup')

const User = require('../models/users')
const Transaction = require('../models/transactions')

module.exports = {
    getBuy (req, res) {
        res.status(200).render('buy.ejs', { error: undefined, message: undefined })
    },
    async buy (req, res) {

        if (!req.body.symbol) {
            res.status(400).render('buy.ejs', { error: 'Must provide symbol', message: undefined })
        }

        if (!req.body.shares){
            res.status(400).render('buy.ejs', { error: 'Must provide shares', message: undefined })
        }

        if (!Number.isInteger(parseInt(req.body.shares))) {
            res.status(400).render('buy.ejs', { error: 'Must provide an integer value', message: undefined })
        }

        if (req.body.shares <= 0){
            res.status(400).render('buy.ejs', { error: 'Must provide a valid shares value', message: undefined })
        }

        try {
            // Consult current stock price from API
            const stock = await lookup.lookup(req.body.symbol)

            // Retrieve user cash from database
            const _id = req.user._id
            const user = await User.findOne({ _id })
            
            // Total purchase value
            const purchaseTotal = stock.latestPrice * req.body.shares 

            // Ensure there's enough cash to complete purchase
            if (purchaseTotal > user.cash) {
                res.render('buy.ejs', { error: 'Insuficient cash', message: undefined })
            }

            // Update users database
            const userUpdated = await User.findByIdAndUpdate( _id, { 
                cash: user.cash - purchaseTotal, 
            }, { new: true }) // return updated project

            // format new transaction
            const newTransaction = {
                user_id: req.user._id,
                symbol: req.body.symbol,
                shares: req.body.shares,
                totalPrice: purchaseTotal
            } 

            // Insert transaction
            await Transaction.create(newTransaction)

            res.status(200).render('buy.ejs', { error: undefined, message: `Successfully complete purchase. Your current cash is $${userUpdated.cash.toFixed(2)}` })   

        } catch {
            res.status(503).render('buy.ejs', { error: 'Unable to get response. Check Symbol spelling.', message: undefined })
        }     
    }
}
