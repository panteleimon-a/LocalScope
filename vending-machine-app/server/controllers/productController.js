const Product = require('../models/Product');

// Add a new product
const addProduct = async (req, res) => {
    const { productName, amountAvailable, cost } = req.body;
    try {
        const newProduct = new Product({ productName, amountAvailable, cost });
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, amountAvailable, cost } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { productName, amountAvailable, cost },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Deposit coins to user's account
const depositCoins = async (req, res) => {
    const { amount } = req.body;
    try {
        let deposit = req.user.deposit || 0;
        deposit += amount;
        req.user.deposit = deposit;
        // ...code to persist deposit if necessary...
        res.json({ deposit });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Buy a product: update product quantity and user's deposit
const buyProduct = async (req, res) => {
    const { productId, amount } = req.body;
    try {
        let deposit = req.user.deposit || 0;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.amountAvailable < amount) {
            return res.status(400).json({ message: 'Not enough product available' });
        }
        const totalPrice = product.cost * amount;
        if (deposit < totalPrice) {
            return res.status(400).json({ message: 'Insufficient deposit' });
        }
        // Deduct purchase and update product
        product.amountAvailable -= amount;
        const updatedProduct = await product.save();
        req.user.deposit -= totalPrice;
        // ...code to persist deposit update if necessary...
        res.json({ product: updatedProduct, deposit: req.user.deposit });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    depositCoins,
    buyProduct
};