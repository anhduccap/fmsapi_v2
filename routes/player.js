const express = require('express');
const router = express.Router();

const playerController = require('../controllers/player');
const middleware = require('../middlewares/index');

// Get all player
router.get('/', middleware.checkToken, playerController.getAllPlayer);

// Get comment with each season
router.get('/:player_id/comment', middleware.checkToken, playerController.getComment);

// Create every single season stat for each player (admin permission)
router.post('/:player_id/statistic', middleware.checkToken, playerController.createStatistic);

// Get specified player stat
router.get('/:player_id/statistic', middleware.checkToken, playerController.getStatistic);

// Get player information
router.get('/:player_id/info', middleware.checkToken, playerController.getPlayer);

module.exports = router;
