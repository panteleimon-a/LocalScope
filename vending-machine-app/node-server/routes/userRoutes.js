const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/:id', authenticate, UserController.getUserById);
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile/deposit', authenticate, UserController.addDeposit);
router.put('/profile/reset', authenticate, UserController.resetDeposit);
router.get('/profile/myproducts', authenticate, UserController.getMyProducts);
router.post('/purchase', authenticate, UserController.purchaseProducts);
router.post('/logout', UserController.logoutUser); // Changed logout route to POST

module.exports = router;