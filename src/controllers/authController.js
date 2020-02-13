const path = require('path')
const bcrypt = require('bcryptjs')

const rootDir = require('../util/path')
const User = require('../models/users')

module.exports = {
    async register(req, res) {
        const { username, email } = req.body

        try {
            if (await User.findOne({ email })){
                return res.status(400).send({ error: 'User already exists'})
            }

            const user = await User.create(req.body)

            // erase password from user return
            user.password = undefined

            return res.send({ user })

        } catch (err) {
            return res.status(400).send({ error: 'Registration failed' })
        }
    },
    registerScreen (req, res) {
        res.status(200).sendFile(path.join(rootDir, 'views', 'register.html'))
    },
    async authenticate (req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select('+password')

        if(!user) {
            return res.status(400).send({ error: 'User not found '})
        }

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Invalid password'})
        }

        // erase password from user return
        user.password = undefined

        res.send({ user })
    },
    authenticateScreen (req, res) {
        res.status(200).sendFile(path.join(rootDir, 'views', 'authenticate.html'))
    }
}
