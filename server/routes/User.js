const express = require('express');
const userController = require('../controllers/user');
const { registerValidation } = require('../validators/authValidator');
const verifyJWT = require('../middleware/verifyJWT');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });
const router = express.Router();

//Register user
router.post('/register', registerValidation, userController.register);

//Login user
router.post('/login', userController.login);

//Update user
router.put('/update/:id', verifyJWT, upload.single('image'), userController.updateProfile);

// Get deatil of user
router.get('/:id', userController.getProfile);

module.exports = router;

