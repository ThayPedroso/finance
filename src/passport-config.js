const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('./models/users')

function initialize(passport){
    const authenticateUser = async (email, password, done) => {

        const user = await User.findOne({ email }).select('+password')

        
        if (user == null) {
            return done(null, false, {message: 'No user with that e-mail'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch(error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (_id, done) => { 
        const user = await User.findOne({ _id })
        return done(null, user)
    })
}

module.exports = initialize