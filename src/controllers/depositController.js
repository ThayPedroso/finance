require('dotenv').config()

const User = require('../models/users')

module.exports = {
    getDeposit (req, res) {
        res.status(200).render('deposit.ejs', { error: undefined, message: undefined })
    },
    async deposit (req, res) {

        if (isNaN(req.body.value)) {
            res.status(400).render('deposit.ejs', { error: 'Must provide a numeric value', message: undefined })
        }

        if (req.body.value <= 0){
            res.status(400).render('deposit.ejs', { error: 'Must provide a positive non zero value', message: undefined })
        }

        const _id = req.user._id

        // deposit value to user's account
        await User.findByIdAndUpdate( _id, { 
            
            $inc: { cash: req.body.value }
            
        }, { new: true }) // return updated project

        res.status(200).render('deposit.ejs', { error: undefined, message: 'Successfully deposit' })
    }
}
