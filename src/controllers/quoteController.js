require('dotenv').config()

const lookup = require('./lookup')

module.exports = {
    getQuote (req, res) {
        res.render('quote.ejs', { companyName: undefined, error: undefined })
    },
    async quote(req, res) {
        try {
            if (!req.body.symbol) {
                res.render('quote.ejs', { error: 'Must provide symbol', companyName: undefined })
            }

            const stock = await lookup.lookup(req.body.symbol)
            res.render('quote.ejs', { error: undefined, companyName: stock.companyName, latestPrice: stock.latestPrice })

        } catch {
            res.render('quote.ejs', { error: 'Must provide a valid symbol', companyName: undefined })
        }
        
    }
}