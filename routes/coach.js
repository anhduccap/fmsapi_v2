const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const coachController = require('../controllers/coach');
const middleware = require('../middlewares/index');

// Get all statistics for a player (admin permission)
router.get('/statistic', middleware.checkToken, coachController.getAllStatistic);

// Suggested lineup
router.get('/suggeted_lineup', middleware.checkToken, coachController.suggestedLineup);

// Update rating
router.post('/update_rating', middleware.checkToken, coachController.updateRating);

// Create comment on player's profile
router.post('/:coach_id/comment/:stat_id', 
    body('content')
        .isLength({min: 5}).withMessage('The comment too long or too short'),
    middleware.checkToken, coachController.comment
);

// Update comment
router.put('/:coach_id/comment/:comment_id',
    body('content')
        .isLength({min: 5, max: 255}).withMessage('The comment too long or too short'),
    middleware.checkToken, coachController.editComment
);

// Delete comment
router.delete('/:coach_id/comment/:comment_id', middleware.checkToken, coachController.deleteComment);

module.exports = router;
