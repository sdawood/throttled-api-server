const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const CORS = require('./util/cors');
const usersRouter = require('./routes/users');
const smsRouter = require('./routes/sms');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(CORS); // Handle CORS headers and OPTIONS method

app.use('/users', usersRouter);
app.use('/sms', smsRouter);

module.exports = app;
