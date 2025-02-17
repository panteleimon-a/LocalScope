const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', UserController.registerUser); // Correct: registerUser is the callback
router.post('/login', UserController.loginUser); // Correct: loginUser is the callback
router.get('/:id', authenticate, UserController.getUserById); // Correct: getUserById is the callback
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile/deposit', authenticate, UserController.addDeposit);
router.put('/profile/reset', authenticate, UserController.resetDeposit);
router.get('/profile/myproducts', authenticate, UserController.getMyProducts);
router.post('/purchase', authenticate, UserController.purchaseProducts); // New route

module.exports = router;