const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event');
const middleware = require('../middlewares/index');

// Get all events
router.get('/', middleware.checkToken, eventController.getAllEvents);

// Get event details
router.get('/:event_id', middleware.checkToken, eventController.eventDetail);

// Create a new event
router.post('/', middleware.checkToken, eventController.createEvent);

// Update event
router.put('/:event_id', middleware.checkToken, eventController.editEvent);

// Delete event
router.delete('/:event_id', middleware.checkToken, eventController.deleteEvent);

module.exports = router;
