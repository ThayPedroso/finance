const axios = require('axios')
require('dotenv').config()

const api_key = process.env.IEX_API_KEY

module.exports = {
    getQuote (req, res) {
        res.render('quote.ejs', { companyName: undefined})
    },
    async quote(req, res) {
        const stock = await lookup(req.body.symbol)
        res.render('quote.ejs', { companyName: stock.companyName, latestPrice: stock.latestPrice })
    },

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