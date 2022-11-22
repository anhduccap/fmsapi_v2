const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth/auth.controller');
const middleware = require('../middlewares/index');

// Creater member (only admin permission)
router.post('/account',
    middleware.checkToken,
    middleware.checkAdminPermission,
    authController.register
);

// Login
router.post('/', 
    body('username')
        .matches(/^(?=.{5,25}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid username'),
    body('password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    authController.login
);

// Forget password
router.post('/account/forget_password',
    body('username')
        .matches(/^(?=.{5,25}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid username'),
    authController.forgetPassword
);

// Reset password
router.get('/account/reset_password',
    authController.resetPassword
);

// Update password
router.put('/account/password',
    body('old_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    body('new_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    body('repeat_new_password')
        .matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage('Invalid password')
        .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
    middleware.checkToken,
    authController.updatePassword
);

// Logout
router.get('/account/logout',
    middleware.checkToken,
    authController.logout,
);

module.exports = router;
