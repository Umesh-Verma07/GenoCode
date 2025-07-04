const { body } = require('express-validator')
const User = require('../models/User')

exports.registerValidation = [
    body('email', 'Enter a valid email')
        .isEmail()
        .bail()
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error("Email already is use");
            }
            return true;
        }),
    body('username', 'Username is required')
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
        .custom((username) => {
            if (/\s/.test(username)) {
                throw new Error("Username cannot contain spaces");
            }
            if (/^\d+$/.test(username)) {
                throw new Error("Username cannot be all numbers");
            }
            return true;
        })
        .custom(async (username) => {
            const user = await User.findOne({ username });
            if (user) {
                throw new Error("Username already in use");
            }
            return true;
        }),
    body('password', 'Password must be at least 6 characters')
        .isLength({ min: 6 })
];