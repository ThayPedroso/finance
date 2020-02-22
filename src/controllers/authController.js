const User = require('../models/users')

module.exports = {
    index (req, res) {
        res.render('home.ejs', { username: req.user.username })
    },
    
    getLogin (req, res) {
        res.render('login.ejs', { layout: 'loginLayout' })
    },
    
    getRegister (req, res) {
        res.render('register.ejs', { layout: 'loginLayout' })
    },
    async postRegister (req, res) {
        const { username, email } = req.body


        try {
            if (await User.findOne({ email })){
                return res.status(400).send({ error: 'User already exists'})
            }

            const user = await User.create(req.body)

            // erase password from user return
            user.password = undefined

            res.redirect('/login')

        } catch (err) {
            res.status(400).send({ error: 'Registration failed' })
            res.redirect('/register')
        }
    },
    
    logout (req, res) {
        req.logOut()
        res.redirect('/login')
    }
}

