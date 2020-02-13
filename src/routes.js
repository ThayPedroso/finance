const path = require('path')
const { Router } = require('express')

const rootDir = require('./util/path')
const authController = require('./controllers/authController')
const financeController = require('./controllers/financeController')

const routes = Router()

routes.get('/auth/register', authController.registerScreen)
routes.post('/auth/register', authController.register)

routes.get('/auth/authenticate', authController.authenticateScreen)
routes.post('/auth/authenticate', authController.authenticate)

routes.get('/', financeController.home)

module.exports = routes