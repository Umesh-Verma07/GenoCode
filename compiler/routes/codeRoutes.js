const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/codeController');
const createRateLimiter = require('../middlewares/rateLimiter');

const runLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: Number(process.env.RUN_RATE_LIMIT_PER_MIN || 60),
});

const submitLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: Number(process.env.SUBMIT_RATE_LIMIT_PER_MIN || 40),
});

const reviewLimiter = createRateLimiter({
	windowMs: 60 * 1000,
	max: Number(process.env.REVIEW_RATE_LIMIT_PER_MIN || 15),
});

router.post('/run', runLimiter, ctrl.run);
router.post('/review', reviewLimiter, ctrl.review);
router.post('/submit', submitLimiter, ctrl.submit);

module.exports = router;