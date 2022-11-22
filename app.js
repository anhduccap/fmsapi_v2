const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const { I18n } = require('i18n');
const path = require('path');

const db = require('./config/db_config');
const indexRouter = require('./routes/index');
const middleware = require('./middlewares/index');
const updateStat = require('./helpers/updateStat');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const i18n = new I18n({
    locales: ['vi','en'],
    directory: path.join(__dirname, 'locales')
});

app.use(i18n.init);
app.set('trust proxy', true)

//connect DB
db();
app.use('/', middleware.checkIP, indexRouter);

// Cron job
updateStat();

module.exports = app;
