const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoDb = require('./config/database');
dotenv.config();

mongoDb();

app.use(express.json());
app.use('/user', require('./routes/User'));


app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.listen(process.env.PORT, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})