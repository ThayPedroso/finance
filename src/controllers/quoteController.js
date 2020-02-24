require('dotenv').config()

const lookup = require('./lookup')

module.exports = {
    getQuote (req, res) {
        res.status(200).render('quote.ejs', { companyName: undefined, error: undefined })
    },
    async quote(req, res) {
        try {
            if (!req.body.symbol) {
                res.status(400).render('quote.ejs', { error: 'Must provide symbol', companyName: undefined })
            }

            const stock = await lookup.lookup(req.body.symbol)
            res.status(200).render('quote.ejs', { error: undefined, companyName: stock.companyName, latestPrice: stock.latestPrice })

        } catch {
            res.status(503).render('quote.ejs', { error: 'Unable to get response. Check Symbol spelling.', companyName: undefined })
        }
        
    }
}