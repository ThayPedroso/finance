const express = require('express')
const routes = require('./routes')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const app = express()

const port = 3001

const initializePassport = require('./passport-config')
initializePassport(
    passport 
)

app.use(express.static('src/public'))

app.set('view-engine', 'ejs')
app.set('views', 'src/views')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => console.log(`Listening at ${port}`))