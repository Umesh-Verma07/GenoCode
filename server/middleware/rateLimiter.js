const bucketMap = new Map();

const getBucket = (key, windowMs) => {
  const now = Date.now();
  const existing = bucketMap.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    const fresh = { windowStart: now, count: 0 };
    bucketMap.set(key, fresh);
    return fresh;
  }

  return existing;
};

const createRateLimiter = ({ windowMs, max }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const key = `${req.path}:${ip}`;
    const bucket = getBucket(key, windowMs);

    bucket.count += 1;
    const remaining = Math.max(max - bucket.count, 0);
    const resetInSec = Math.ceil((windowMs - (Date.now() - bucket.windowStart)) / 1000);

    res.setHeader('x-ratelimit-limit', String(max));
    res.setHeader('x-ratelimit-remaining', String(remaining));
    res.setHeader('x-ratelimit-reset', String(resetInSec));

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again shortly.',
        retryAfterSeconds: resetInSec,
      });
    }

    next();
  };
};

module.exports = createRateLimiter;
