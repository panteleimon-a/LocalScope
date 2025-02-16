const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/add', authenticate, ProductController.createProduct);
router.put('/update/:id', authenticate, ProductController.updateProduct); // Changed to /update/:id
router.delete('/delete/:id', authenticate, ProductController.deleteProduct); // Changed to /delete/:id

module.exports = router;