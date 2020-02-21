const axios = require('axios')
require('dotenv').config()

const User = require('../models/users')

const api_key = process.env.IEX_API_KEY

module.exports = {
    getQuote (req, res) {
        res.render('quote.ejs', { companyName: undefined, error: undefined })
    },
    async quote(req, res) {
        try {
            if (!req.body.symbol) {
                res.render('quote.ejs', { error: 'Must provide symbol', companyName: undefined })
            }

            const stock = await lookup(req.body.symbol)
            res.render('quote.ejs', { error: undefined, companyName: stock.companyName, latestPrice: stock.latestPrice })

        } catch {
            res.render('quote.ejs', { error: 'Must provide a valid symbol', companyName: undefined })
        }
        
    },
    getBuy (req, res) {
        res.render('buy.ejs', { error: undefined, message: undefined })
    },
    async buy (req, res) {

        if (!req.body.symbol) {
            res.render('buy.ejs', { error: 'Must provide symbol', message: undefined })
        }

        if (!req.body.shares){
            res.render('buy.ejs', { error: 'Must provide shares', message: undefined })
        }

        if (!Number.isInteger(parseInt(req.body.shares))) {
            res.render('buy.ejs', { error: 'Must provide an integer value', message: undefined })
        }

        if (req.body.shares <= 0){
            res.render('buy.ejs', { error: 'Must provide a valid shares value', message: undefined })
        }

        // Consult current stock price from API
        const stock = await lookup(req.body.symbol)
        
        if (!stock) {
            res.render('buy.ejs', { error: 'Must provide a valid symbol', message: undefined })
        }
        
        // Retrieve user cash from database
        const _id = req.user._id
        const user = await User.findOne({ _id })
        
        // Total purchase value
        const purchaseTotal = stock.latestPrice * req.body.shares 

        // Ensure there's enough cash to complete purchase
        if (purchaseTotal > user.cash) {
            res.render('buy.ejs', { error: 'Insuficient cash', message: undefined })
        }

        // Update database
        const userUpdated = await User.findByIdAndUpdate( _id, { 
            cash: user.cash - purchaseTotal, 
        }, { new: true }) // return updated project
        
        console.log(userUpdated)

        res.render('buy.ejs', { error: undefined, message: `Successfully complete purchase. Your current cash is $${userUpdated.cash}` })        
    }
}

async function lookup(stockSymbol) {
    const apiResponse = await axios.get(`https://cloud-sse.iexapis.com/stable/stock/${stockSymbol}/quote?token=${api_key}`)

    const { symbol, companyName, latestPrice, latestUpdate } = apiResponse.data

    const stockInfo = {
        symbol, 
        companyName,
        latestPrice,
        latestUpdate,
    }
    //console.log(stockInfo)

    return stockInfo
}