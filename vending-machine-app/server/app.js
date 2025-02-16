const express = require('express');
const app = express();
const port = 3000;

// SQL Server connection configuration (REPLACE with your actual credentials)
const config = {
    user: 'sa', // Your SQL Server username
    password: 'je2v!he6', // Your SQL Server password
    server: 'localhost', // Your SQL Server instance name or IP address
    database: 'VendingMachineDB', // Your database name
    pool: {  // Connection pooling for better performance
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
};

app.use(express.json());

// Import middleware and controllers
const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

// Authentication routes
app.post('/login', authController.login);
app.post('/user', authController.register);  // Registration

// User routes (protected)
app.get('/user', authMiddleware.authenticate, userController.getAllUsers);
app.post('/logout/all', authMiddleware.authenticate, userController.logoutAll);

// Product routes
app.get('/product', productController.getAllProducts);
app.post('/product', authMiddleware.authenticate, authMiddleware.authorize('seller'), productController.addProduct); // Seller only
app.put('/product/:id', authMiddleware.authenticate, authMiddleware.authorize('seller'), productController.updateProduct); // Seller only
app.delete('/product/:id', authMiddleware.authenticate, authMiddleware.authorize('seller'), productController.deleteProduct); // Seller only

// Buyer routes (protected)
app.post('/deposit', authMiddleware.authenticate, authMiddleware.authorize('buyer'), productController.depositCoins); // Buyer only
app.post('/buy', authMiddleware.authenticate, authMiddleware.authorize('buyer'), productController.buyProduct);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});