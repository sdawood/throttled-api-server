const {RateLimiter} = require('limiter');
const express = require('express');
const capacity = require('../api/middleware/capacity');
const checkAuth = require('../api/middleware/check-auth');

// eslint-disable-next-line new-cap
const router = express.Router();

/* GET users listing. */
const {endpoints: {sms: {capacity: {limit, interval} = {}} = {}}} = require('../config');

const twilio = require('twilio');
router.post('/', capacity(limit, interval), checkAuth, (req, res, next) => {
    const accountSid = process.env['TWILIO_ACCOUNT_SID'];
    const authToken = process.env['TWILIO_AUTH_TOKEN'];
    const messagingServiceSid = process.env['TWILIO_MESSAGING_SERVICE_SID'];
    const fromNumber = process.env['TWILIO_FROM_NUMBER'];

// eslint-disable-next-line new-cap
    const client = new twilio(accountSid, authToken);
    client.messages.create({
        to: req.body.to,
        from: req.body.from || fromNumber,
        body: req.body.body,
        messagingServiceSid
    })
    .then(message => res.json(message))
    .catch(error => res.status(500).json({...error, details: 'No backup service configured'}));
});

module.exports = router;
