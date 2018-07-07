const {RateLimiter} = require('limiter');
const express = require('express');
const checkAuth = require('../api/middleware/check-auth');
const capacity = require('../api/middleware/capacity');
// eslint-disable-next-line new-cap
const router = express.Router();
const {endpoints: {users: {capacity: {limit, interval} = {}} = {}}} = require('../config');

/* GET users listing. */
const limiter = capacity(limit, interval);
router.limiter = limiter; // expose for testing and allow reset TokenBucket content

router.get('/', limiter, checkAuth, (req, res, next) => {
    res.json(require('../data/users').all);
    next();
});

module.exports = router;
