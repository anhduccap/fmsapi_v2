const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const CORS = require('cors');
const swaggerDoc = require('swagger-ui-express');

const db = require('./config/db_config');
const indexRouter = require('./routes/index');
const swaggerSetup = require('./config/swagger');

const app = express();

// app.use(CORS());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization, auth-token');
//   next();
// })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connect DB
db();

app.use('/api/documentations', swaggerDoc.serve);
app.use('/api/documentations', swaggerDoc.setup(swaggerSetup));
app.use('/', indexRouter);

module.exports = app;
