const express = require('express');
const app = express();
const dotenv = require('dotenv');
const generateFile = require('./generateFile');
const generateInputFile = require('./generateInputFile');
const executeCode = require('./executeCode');
const cors = require('cors')
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/run', async(req, res)=>{
    const {code, language, input} = req.body;
    if(!code){
        return res.status(400).json({success: false, error: "Empty code body"});
    }
    try {
        const filePath = generateFile(code, language);
        const inputPath = generateFile(input);
        const output = await executeCode(filePath, language, inputPath);
        return res.status(200).json({success: true, output : output.stdout});
    } catch (error) {
        return res.status(400).json({success : false, error});
    }
})

app.get("/", (req, res) =>{
    res.send("Hello World");
})

app.listen(process.env.PORT, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})
