const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://thaypedroso:omnistack2020@cluster0-xk1im.mongodb.net/finance?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

module.exports = mongoose