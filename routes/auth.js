const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const middleware = require('../middlewares/index');

// Creater member (admin)
router.post('/member', middleware.checkToken, authController.register);

// Login
router.post('/', 
    body('username')
        .matches(/^(?=.{5,25}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid username'),
    body('password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    authController.login
);

// Update phone number
router.put('/member/:member_id/phone', 
    body('phone').matches(/([3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\b/).withMessage('Invalid phone number'),
    middleware.checkToken, authController.updatePhone
);

// Update email address
router.put('/member/:member_id/email', 
    body('email').matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage('Invalid email'),
    middleware.checkToken, authController.updateEmail
);

// Update password
router.put('/member/:member_id/password',
    body('old_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    body('new_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    body('repeat_new_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    middleware.checkToken, authController.updatePassword
);

// Reset password (admin)
router.put('/member/:member_id/reset_password', middleware.checkToken, authController.resetPassword);

module.exports = router;
