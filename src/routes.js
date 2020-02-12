const { Router } = require('express')
const authController = require('./controllers/authController')

const routes = Router()

routes.post('/auth/register', authController.register)
routes.post('/auth/authenticate', authController.authenticate)

module.exports = routes