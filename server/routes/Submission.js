const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission.js')

router.post('/:id', async(req, res)=>{
    const {id} = req.params;
    const {email, code, title, language, level} = req.body;

    try {
        const sub = new Submission({problemId: id, problemName: title, email, code, language, level});
        await sub.save();
        res.status(200).json({success: true, message: "Problem Submitted"});
    } catch (error) {
        res.status(400).json({success: false, error: error});
    }
})

module.exports = router;