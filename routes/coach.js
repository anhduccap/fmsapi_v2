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


// ----- COMMENT -----
// Create comment on player's profile
router.post('/:coach_id/comment/:player_id', 
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




// ----- LECTURE -----
// GET /
router.get('/:coach_id/lectures', middleware.checkToken, coachController.getAllLecture);

// GET /lecture_id
router.get('/:coach_id/lecture/:lecture_id', middleware.checkToken, coachController.getLecture);

// POST /
router.post('/:coach_id/lecture', middleware.checkToken, coachController.createLecture);

// PUT /lecture_id
router.put('/:coach_id/lecture/:lecture_id', middleware.checkToken, coachController.editLecture);

// DELETE /lecture_id
router.delete('/:coach_id/lecture/:lecture_id', middleware.checkToken, coachController.deleteLecture);



// ----- ANNOUNCEMENT -----
// GET /
router.get('/:coach_id/announcements', middleware.checkToken, coachController.getAllAnnouncement);

// POST /
router.post('/:coach_id/announcement', middleware.checkToken, coachController.createAnnouncement);

module.exports = router;
