const { Router } = require('express')
const passport = require('passport')

const authController = require('./controllers/authController')
const financeController = require('./controllers/financeController')

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

routes.get('/quote', checkAuthenticated, financeController.getQuote)

routes.post('/quote', checkAuthenticated, financeController.quote)

routes.get('/buy', checkAuthenticated, financeController.getBuy)

routes.post('/buy', checkAuthenticated, financeController.buy)

routes.get('/index', checkAuthenticated, financeController.index)

routes.get('/sell', checkAuthenticated, financeController.getSell)

routes.post('/sell', checkAuthenticated, financeController.sell)

routes.get('/history', checkAuthenticated, financeController.history)

routes.get('/deposit', checkAuthenticated, financeController.getDeposit)

routes.post('/deposit', checkAuthenticated, financeController.deposit)

module.exports = routes