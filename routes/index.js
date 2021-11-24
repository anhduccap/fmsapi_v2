const express = require('express');
const router = express.Router();

const helper = require('../helpers/index');
const authRouter = require('./auth');
const homeRouter = require('./home');
const playerRouter = require('./player');
const coachRouter = require('./coach');

router.use('/auth', authRouter);
router.use('/', homeRouter);
router.use('/player', playerRouter);
router.use('/coach', coachRouter);


// catch 404 and forward to error handler
router.use(function(req, res, next) {
  res
      .status(404)
      .send( helper.responseFailure(false, '404', 'Page not found', {url: req.originalUrl + ' not found'}) );
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(helper.responseFailure(false, err.status || 500, err.message, {}));
});

module.exports = router;
