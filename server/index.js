const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const mongoDb = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
mongoDb();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/user', require('./routes/User'));
app.use('/problem', require('./routes/Problem'));
app.use('/submit', require('./routes/Submission'));


app.get('/', (req, res)=>{
    res.send("Hello World");
})

// Global error handler 
app.use(errorHandler);

app.listen(`${process.env.PORT}`, ()=>{
    console.log(`Listening at port ${process.env.PORT}`);
})