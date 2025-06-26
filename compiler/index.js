const express = require('express');
const app = express();
const dotenv = require('dotenv');
const generateFile = require('./generateFile');
const executeCpp = require('./executeCpp');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/run', async(req, res)=>{
    const {code, language} = req.body;
    if(!code){
        return res.status(400).json({success: false, error: "Empty code body"});
    }
    try {
        const filePath = generateFile(code, language);
        const output = await executeCpp(filePath);
        console.log(filePath);
        res.send({filePath, output});
    } catch (error) {
        res.status(400).json({success : false, error: error.error});
    }
})

app.get("/", (req, res) =>{
    res.send("Hello World");
})

app.listen(process.env.PORT, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})
