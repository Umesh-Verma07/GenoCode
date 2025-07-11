const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { runCode } = require('./services/executionService');
const { checkAndSubmit } = require('./services/submissionService');
const { runQueue, submitQueue } = require('./config/queue');
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

runQueue.process(1, async job => {
  const { file, language, input } = job.data;
  // runCode will compile and run
  const stdout = await runCode(file, language, input);
  return { stdout };
});


submitQueue.process(1, async job => {
  const { file, code, language, problemId, email } = job.data;
  // checkAndSubmit will test, enqueue DB submit, and delete source
  const verdict = await checkAndSubmit(file, code, language, problemId, email);
  return verdict;
});


runQueue.on('failed', (job, err) => console.error('Run job failed:', err));
submitQueue.on('failed', (job, err) => console.error('Submit job failed:', err));
