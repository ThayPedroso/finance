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

module.exports = routes