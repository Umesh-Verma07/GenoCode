const express = require('express');
const User = require('../models/User')
const Submission = require('../models/Submission')
const Problem = require('../models/Problem')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { registerValidation } = require('../validators/authValidator')

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const verifyJWT = require('../validators/verifyJwt');
const upload = multer({ storage });

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
            username: req.body.username,
            password: hashPass,
        })
        await newUser.save();
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, error: error });
    }
});

router.post('/login', async (req, res) => {

    let { userId, password } = req.body;
    try {
        let userData;
        if (userId.includes('@')) {
            userData = await User.findOne({ email: userId });
        } else {
            userData = await User.findOne({ username: userId });
        }
        if (!userData) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isValidPass = await bcrypt.compare(password, userData.password);
        if (!isValidPass) {
            return res.status(400).json({ error: "Invalid Password" });
        }

        const authToken = jwt.sign({ email: userData.email, isAdmin: userData.isAdmin, username: userData.username, image: userData.image }, process.env.JWTSECRET);
        return res.json({ success: true, authToken: authToken });

    } catch (error) {
        res.json({ success: false, error: error });
    }
});

router.put('/update/:id', verifyJWT, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    if (req.user.username != id) {
        return res.status(403).json({ success: false, error: "Access Denied!" });
    }
    const { name, institute, location, skills, removeImage } = req.body;
    try {
        const user = await User.findOne({ username: id });

        if (user.image && (removeImage === 'true' || req.file && user.image.includes('cloudinary.com'))) {
            const parts = user.image.split('/');
            const fileWithExt = parts[parts.length - 1];
            const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(`Online_Judge/${publicId}`);
            user.image = '';
        }

        user.name = name;
        user.institute = institute;
        user.location = location;
        user.skills = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (req.file && req.file.path) {
            user.image = req.file.path;
        }

        await user.save();
        res.json({ success: true, message: "User Updated!" });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ username: id });
        if (!user) {
            return res.status(400).json({ success: false, error: "User not found!" });
        }
        let problem = [];
        if (user.isAdmin) {
            problem = await Problem.find({ email: user.email });
        } else {
            problem = await Submission.find({ email: user.email });
        }
        res.json({ success: true, user, problem });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
})

module.exports = router;

