const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { registerValidation } = require('../validators/authValidator');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });


// Register a new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashPass,
    });
    await newUser.save();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { userId, password } = req.body;
  try {
    // Find by email or username
    const userData = userId.includes('@') ? await User.findOne({ email: userId }) : await User.findOne({ username: userId });
    if (!userData) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Verify password
    if (!bcrypt.compareSync(password, userData.password)) {
      return res.status(400).json({ success: false, error: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { email: userData.email, isAdmin: userData.isAdmin, username: userData.username, image: userData.image },
      process.env.JWTSECRET
    );
    return res.json({ success: true, authToken: token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Update user profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  if (req.user.username !== id) {
    return res.status(403).json({ success: false, error: 'Access Denied' });
  }

  const { name, institute, location, skills, removeImage } = req.body;
  try {
    const user = await User.findOne({ username: id });
    // Handle image removal
    if ((removeImage === 'true' || req.file) && user.image) {
      const publicId = user.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`GenoCode/${publicId}`);
      user.image = '';
    }

    // Update fields
    user.name = name;
    user.institute = institute;
    user.location = location;
    user.skills = skills ? skills.split(',').map(s => s.trim()) : [];
    if (req.file) user.image = req.file.path;

    await user.save();
    return res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Get user profile and problems/submissions
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ username: id });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // If admin, list created problems; else list submissions
    const list = user.isAdmin ? await Problem.find({ email: user.email }) : await Submission.find({ email: user.email });
    
    return res.json({ success: true, user, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


