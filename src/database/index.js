const mongoose = require('mongoose')
require('dotenv').config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const name = process.env.DB_NAME

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0-xk1im.mongodb.net/${name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

module.exports = mongoose