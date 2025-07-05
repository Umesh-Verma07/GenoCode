const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const generateFile = require('./generateFile');
const runCode = require('./runCode');
const submitCode = require('./submitCode');
const generateAIReview = require('./generateAIReview');
const cors = require('cors')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/submit', async(req, res)=>{
    const {code, language, problemId, email} = req.body;
    if(!code){
        return res.status(400).json({success: false, error: "Empty code body"});
    }
    try {
        const filePath = generateFile(code, language);
        const output = await submitCode(filePath, code, language, problemId, email);
        return res.status(200).json({success: true, output : output.message});
    } catch (error) {
        return res.status(400).json({success : false, error});
    }
})

app.post('/run', async(req, res)=>{
    const {code, language, input} = req.body;
    if(!code){
        return res.status(400).json({success: false, error: "Empty code body"});
    }
    try {
        const filePath = generateFile(code, language);
        const output = await runCode(filePath, language, input);
        //delete file
        return res.status(200).json({success: true, output : output});
    } catch (error) {
        return res.status(400).json({success : false, error});
    }
})

app.post('/review', async(req, res)=>{
    const {code, problem} = req.body;
    if(!code){
        return res.status(400).json({success: false, error: "Empty code body"});
    }
    try {
        const response = await generateAIReview(code, problem);
        res.status(200).json({success : true, text : response});
    } catch (error) {
        return res.status(400).json({success : false, error});
    }
})

app.get("/", (req, res) =>{
    res.send("Hello World");
})

app.listen(`${process.env.PORT}`, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})
