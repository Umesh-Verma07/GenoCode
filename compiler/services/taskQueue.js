const MAX_CONCURRENT_TASKS = Math.max(Number(process.env.MAX_CONCURRENT_TASKS || 4), 1);
const MAX_QUEUE_SIZE = Math.max(Number(process.env.MAX_QUEUE_SIZE || 200), 1);

const pending = [];
let activeCount = 0;

const dequeue = () => {
  if (activeCount >= MAX_CONCURRENT_TASKS) return;
  const next = pending.shift();
  if (!next) return;

  activeCount += 1;

  Promise.resolve()
    .then(next.task)
    .then(next.resolve)
    .catch(next.reject)
    .finally(() => {
      activeCount -= 1;
      dequeue();
    });
};

const enqueueTask = (task) => {
  if (typeof task !== 'function') {
    return Promise.reject(new Error('Task must be a function returning a promise.'));
  }

  if (pending.length >= MAX_QUEUE_SIZE) {
    const err = new Error('Server is busy. Please retry shortly.');
    err.statusCode = 503;
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    pending.push({ task, resolve, reject });
    dequeue();
  });
};

const getQueueStats = () => ({
  activeCount,
  pendingCount: pending.length,
  maxConcurrent: MAX_CONCURRENT_TASKS,
  maxQueueSize: MAX_QUEUE_SIZE,
});

module.exports = { enqueueTask, getQueueStats };
