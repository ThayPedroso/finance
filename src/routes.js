const { Router } = require('express')
const passport = require('passport')

const authController = require('./controllers/authController')
const quoteController = require('./controllers/quoteController')
const buyController = require('./controllers/buyController')
const sellController = require('./controllers/sellController')
const indexController = require('./controllers/indexController')
const historyController = require('./controllers/historyController')
const depositController = require('./controllers/depositController')

const routes = Router()

routes.get('/', checkAuthenticated, authController.index)

routes.get('/login', checkNotAuthenticated, authController.getLogin)

routes.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

routes.get('/register', checkNotAuthenticated, authController.getRegister)

routes.post('/register', checkNotAuthenticated, authController.postRegister)

routes.delete('/logout', authController.logout)

routes.get('/quote', checkAuthenticated, quoteController.getQuote)

routes.post('/quote', checkAuthenticated, quoteController.quote)

routes.get('/buy', checkAuthenticated, buyController.getBuy)

routes.post('/buy', checkAuthenticated, buyController.buy)

routes.get('/index', checkAuthenticated, indexController.index)

routes.get('/sell', checkAuthenticated, sellController.getSell)

routes.post('/sell', checkAuthenticated, sellController.sell)

routes.get('/history', checkAuthenticated, historyController.history)

routes.get('/deposit', checkAuthenticated, depositController.getDeposit)

routes.post('/deposit', checkAuthenticated, depositController.deposit)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}

module.exports = routes