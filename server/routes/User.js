const express = require('express');
const User = require('../models/User')
const Submission = require('../models/Submission')
const Problem = require('../models/Problem')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { registerValidation } = require('../validators/authValidator')

router.post('/register', ...registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    // Encrypting Password
    let password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
        })
        await newUser.save();
        return res.json({ success: true });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, error: error });
    }
});

router.post('/login', async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { email, password } = req.body;

    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isValidPass = await bcrypt.compare(password, userData.password);
        if (!isValidPass) {
            return res.status(400).json({ error: "Invalid Password" });
        }

        const authToken = jwt.sign({ email: userData.email, isAdmin: userData.isAdmin }, process.env.JWTSECRET);
        return res.json({ success: true, authToken: authToken });

    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ email: id });
        if (!user) {
            return res.status(400).json({ success: false, error: "User not found!" });
        }
        let problem = [];
        if(user.isAdmin){
            problem = await Problem.find({email: user.email});
        }else{
            problem = await Submission.find({user: user._id});
        }
        res.json({ success: true, user, problem});
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
})

module.exports = router;

