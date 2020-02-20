const path = require('path')
const express = require('express')
const routes = require('./routes')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const app = express()

const port = 3001

const initializePassport = require('./passport-config')
initializePassport(
    passport 
)

app.set('views', path.join('src', 'views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)
app.use(expressLayouts) 
app.use(express.static(path.join('src', 'public')))

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