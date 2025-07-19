const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');
const errorHandler = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', codeRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.listen(PORT, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});