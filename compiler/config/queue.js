const Queue = require('bull');

const redisOpts = {
  host:      process.env.REDIS_HOST,
  port:     +process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

const runQueue    = new Queue('code-run',    { redis: redisOpts });
const submitQueue = new Queue('code-submit', { redis: redisOpts });

runQueue.on('error',    err => console.error('runQueue error', err));
submitQueue.on('error', err => console.error('submitQueue error', err));

module.exports = { runQueue, submitQueue };
