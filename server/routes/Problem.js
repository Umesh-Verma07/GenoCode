const express = require('express')
const Problem = require('../models/Problem.js')
const User = require('../models/User.js')
const router = express.Router();

router.get("/list", async(req, res) =>{
    try{
        let problem = await Problem.find({});
        res.json({ success: true, problem});

    } catch(e){
        res.status(400).json({success: false, error: e.message});
    }
});

router.post("/create", async (req, res) =>{
   try{
    const {title, description, level, testCases, email} = req.body;

    
    if(!title || !description || !level || !testCases || !email){
        return res.status(500).json({success : false, error : "All fields are required!"});
    }
    const user = await User.find({email});

    if(!user || (!user[0].isAdmin)){
        return res.status(500).json({success : false, error : "Unauthorized: Only admin can create the problem"});
    }

    const newProblem = new Problem({title, description, level, testCases, email});
    await newProblem.save();
    res.json({ success : true, message: "Problem created Successfully"});

   } catch(e){
    res.status(500).json({success : false, error : e.message});
   }
});

router.post("/update/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const { title, description, level, testCases, email } = req.body;
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        if (problem.email !== email) {
            return res.status(403).json({ error: "Unauthorized: Only the creator can update this problem"});
        }
        problem.title = title;
        problem.description = description;
        problem.level = level;
        problem.testCases = testCases;
        await problem.save();
        res.json({success: true, message: "Problem updated"});

    }catch(e){
        res.status(500).json({ error: e.message });
    }
});

router.delete('/delete/:id', async(req, res)=>{
    try {
        let {id} = req.params;
        const {email} = req.body;
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({success : false, error: "Problem not found" });
        }

        if(problem.email !== email){
            return res.status(500).json({success: false, error : "Unauthorized: Only the creator can delete this problem"});
        }

        await Problem.findByIdAndDelete(id);
        return res.json({success: true, message: "Problem deleted successfully"});
    } catch (err) {
        return res.status(500).json({success: false, error: err.message });
    }
});

router.get('/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const problem = await Problem.findById(id);
        if(!problem){
            return res.status(400).json({success: true, error : "Problem not found!"});
        }
        res.json({success: true, problem});
    } catch (error) {
        return res.status(500).json({success: false, error : error.message});
    }
})

module.exports = router;