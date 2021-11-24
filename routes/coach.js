const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const coachController = require('../controllers/coach');
const middleware = require('../middlewares/index');

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
