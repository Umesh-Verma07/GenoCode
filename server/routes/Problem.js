const express = require('express')
const verifyJWT = require('../middleware/verifyJWT.js');
const problemController = require('../controllers/problem');
const router = express.Router();

// public listing
router.get('/list', problemController.listProblems);

// Create, requires valid JWT and admin role
router.post('/create', verifyJWT, problemController.createProblem);

// Update, requires valid JWT
router.post('/update/:id', verifyJWT, problemController.updateProblem);

// Delete by id
router.delete('/delete/:id', verifyJWT, problemController.deleteProblem);

// Fetch test cases
router.get('/test/:id', problemController.getTestCases);

// Fetch single problem detail
router.get('/:id', problemController.getProblemById);

module.exports = router;