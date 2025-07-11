const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/codeController');

router.post('/run',    ctrl.run);
router.post('/review', ctrl.review);
router.post('/submit', ctrl.submit);

module.exports = router;