const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/:id', authenticate, UserController.getUserById);
router.get('/profile', authenticate, UserController.getProfile); // New route for profile
router.put('/profile/deposit', authenticate, UserController.addDeposit); // Add deposit
router.put('/profile/reset', authenticate, UserController.resetDeposit); // Reset deposit

module.exports = router;