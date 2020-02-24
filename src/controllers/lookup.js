const axios = require('axios')
require('dotenv').config()

const api_key = process.env.IEX_API_KEY

module.exports = {
    async lookup(stockSymbol) {
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
}
