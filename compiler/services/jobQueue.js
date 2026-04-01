const Bull = require('bull');
const { runCode } = require('./executionService');
const { checkAndSubmit } = require('./submissionService');
const generateAIReview = require('./reviewService');
const { writeCodeToFile, deleteFile } = require('./fileService');
const { enqueueTask: enqueueLocalTask, getQueueStats: getLocalQueueStats } = require('./taskQueue');

const QUEUE_NAME = process.env.QUEUE_NAME || 'compiler-jobs';
const REDIS_URL = process.env.REDIS_URL;
const REDIS_ENABLED = Boolean(REDIS_URL);
const WORKER_CONCURRENCY = Math.max(Number(process.env.QUEUE_WORKER_CONCURRENCY || 4), 1);

let queue = null;
let processorsInitialized = false;

const serializeError = (error) => {
  const payload = {
    message: error?.message || String(error),
    type: error?.type,
    statusCode: error?.statusCode || error?.status,
  };
  return new Error(JSON.stringify(payload));
};

const parseSerializedError = (error) => {
  if (!error) return new Error('Unknown queue error');
  try {
    const parsed = JSON.parse(error.message || '{}');
    const wrapped = new Error(parsed.message || 'Queue task failed');
    if (parsed.type) wrapped.type = parsed.type;
    if (parsed.statusCode) wrapped.statusCode = parsed.statusCode;
    return wrapped;
  } catch {
    return error;
  }
};

const executeRun = async ({ code, language, input }) => {
  const file = writeCodeToFile(code, language);
  try {
    const output = await runCode(file, language, input);
    return { output };
  } finally {
    deleteFile(file);
  }
};

const executeSubmit = async ({ code, language, problemId, email }) => {
  const file = writeCodeToFile(code, language);
  try {
    const verdict = await checkAndSubmit(file, code, language, problemId, email);
    return { verdict };
  } finally {
    deleteFile(file);
  }
};

const executeReview = async ({ code, problem }) => {
  const text = await generateAIReview(code, problem);
  return { text };
};

const dispatchLocal = (type, payload) => {
  const map = {
    run: () => executeRun(payload),
    submit: () => executeSubmit(payload),
    review: () => executeReview(payload),
  };

  const task = map[type];
  if (!task) return Promise.reject(new Error(`Unknown task type: ${type}`));
  return enqueueLocalTask(task);
};

const getQueue = () => {
  if (!REDIS_ENABLED) return null;
  if (!queue) {
    queue = new Bull(QUEUE_NAME, REDIS_URL);
  }
  return queue;
};

const initProcessors = () => {
  const q = getQueue();
  if (!q || processorsInitialized) return;

  q.process(WORKER_CONCURRENCY, async (job) => {
    const { type, payload } = job.data || {};

    try {
      if (type === 'run') return await executeRun(payload);
      if (type === 'submit') return await executeSubmit(payload);
      if (type === 'review') return await executeReview(payload);
      throw new Error(`Unsupported job type: ${type}`);
    } catch (error) {
      throw serializeError(error);
    }
  });

  processorsInitialized = true;
};

const enqueueTask = async (type, payload) => {
  if (!REDIS_ENABLED) {
    return dispatchLocal(type, payload);
  }

  initProcessors();
  const q = getQueue();
  const job = await q.add(
    { type, payload },
    {
      removeOnComplete: true,
      removeOnFail: 100,
      attempts: 1,
    }
  );

  try {
    return await job.finished();
  } catch (error) {
    throw parseSerializedError(error);
  }
};

const getQueueStats = async () => {
  if (!REDIS_ENABLED) {
    return { mode: 'memory', ...(getLocalQueueStats()) };
  }

  initProcessors();
  const q = getQueue();
  const counts = await q.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
  return {
    mode: 'redis',
    name: QUEUE_NAME,
    concurrency: WORKER_CONCURRENCY,
    counts,
  };
};

module.exports = {
  enqueueTask,
  getQueueStats,
};
