const express = require('express');
const router = express.Router();
const { getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;