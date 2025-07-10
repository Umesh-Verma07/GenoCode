const { body } = require('express-validator');
const User = require('../models/User');

exports.registerValidation = [
    // Validate email
    body('email', 'Please provide a valid email')
        .isEmail()
        .bail()
        .custom(async (email) => {
            const exists = await User.findOne({ email });
            if (exists) {
                throw new Error('Email is already in use');
            }
            return true;
        }),

    // Validate username
    body('username', 'Username is required')
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom((username) => {
            if (/\s/.test(username)) {
                throw new Error('Username cannot contain spaces');
            }
            if (/^\d+$/.test(username)) {
                throw new Error('Username cannot be all numbers');
            }
            return true;
        })
        .bail()
        .custom(async (username) => {
            const exists = await User.findOne({ username });
            if (exists) {
                throw new Error('Username is already in use');
            }
            return true;
        }),

    // Validate password
    body('password', 'Password must be at least 6 characters long')
        .isLength({ min: 6 })
];
