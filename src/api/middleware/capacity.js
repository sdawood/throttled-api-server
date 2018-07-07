const {RateLimiter} = require('limiter');

const limiter = (count, interval) => {
  if (!count) return next();
  const rateLimiter = new RateLimiter(count, interval);
  const limit = (req, res, next) => {

    if (rateLimiter.tryRemoveTokens(1)) {
      console.log('Tokens removed');
      next();
    } else {
      const wait = (rateLimiter.tokenBucket.lastDrip + rateLimiter.tokenBucket.interval - new Date()) / 1000;
      res.status(429).json({
        code: 'Provisioned rate exceeded',
        wait,
        unit: 'seconds',
        message: `Try again in ${wait} seconds`,

      });
      console.log('No tokens removed');
    }
  };
  limit.rateLimiter = rateLimiter;
  return limit;
};


module.exports = limiter;

