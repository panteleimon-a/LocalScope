// filepath: /Users/pante/Repos/Git_Repositories/LocalScope/vending-machine-app/server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.post('/', authenticate, authorize('seller'), create);

module.exports = router;