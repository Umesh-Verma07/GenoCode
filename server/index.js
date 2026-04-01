const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const mongoDb = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const requestContext = require('./middleware/requestContext');
const createRateLimiter = require('./middleware/rateLimiter');

dotenv.config();
mongoDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestContext);
app.use(createRateLimiter({ windowMs: 60 * 1000, max: Number(process.env.API_RATE_LIMIT_PER_MIN || 300) }));

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