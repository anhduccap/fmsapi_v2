const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const middleware = require('../middlewares/index');

/* GET home page. */
router.get('/', homeController.index);

// Get basic information
router.get('/personal_information/:member_id', middleware.checkToken, homeController.getBasicInformation);

module.exports = router;
