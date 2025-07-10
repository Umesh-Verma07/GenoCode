const express = require('express');
const submissionController = require('../controllers/submission');
const router = express.Router();

router.post('/:id', submissionController.submit);

module.exports = router;