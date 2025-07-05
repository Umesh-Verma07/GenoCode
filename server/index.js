const express = require('express');
const dotenv = require('dotenv')
const mongoDb = require('./config/database');
const cors = require('cors')

const app = express();
dotenv.config();
mongoDb();

app.use(cors());

app.use(express.json());
app.use('/user', require('./routes/User'));
app.use('/problem', require('./routes/Problem'));
app.use('/submit', require('./routes/Submission'));


app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.listen(`${process.env.PORT}`, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})