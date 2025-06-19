const {body} = require('express-validator')
const User = require('../models/User')

exports.registerValidation = [
    body('email', 'Enter a valid email').isEmail().bail()
    .custom(async (email) => {
        const user = await User.findOne({email});
        if(user){
            throw new Error("Email already is use");
        }
        return true;
    }),

    body('password', 'Password must be at least 6 characters').isLength({min : 6})
];