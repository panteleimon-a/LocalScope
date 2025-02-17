const { poolPromise } = require('../config/db');
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const UserController = {
    registerUser: async (req, res) => {
        const { username, password, role = 'buyer' } = req.body;

        try {
            const pool = await poolPromise;

            const hashedPassword = await bcrypt.hash(password, 10);
            const request = new mssql.Request(pool);

            request.input('username', mssql.VarChar, username);
            request.input('password', mssql.VarChar, hashedPassword);
            request.input('role', mssql.VarChar, role);

            const result = await request.query(
                'INSERT INTO Users (Username, Password, Role) VALUES (@username, @password, @role); SELECT SCOPE_IDENTITY() AS id;'
            );

            const userId = result.recordset[0].id; // Consistent lowercase 'id'
            res.status(201).json({ message: 'User registered successfully', userId });

        } catch (err) {
            console.error("Error in registerUser:", err);
            if (err.code === 'SQLITE_CONSTRAINT') { // Adapt this if not using SQL Server
                res.status(400).json({ message: 'Username already exists' });
            } else {
                res.status(500).json({ message: 'Server error during registration' });
            }
        }
    },

    loginUser: async (req, res) => {
        const { username, password } = req.body;

        try {
            const pool = await poolPromise;

            const request = new mssql.Request(pool);
            request.input('username', mssql.VarChar, username);

            const result = await request.query('SELECT * FROM Users WHERE Username = @username');

            if (result.recordset.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = result.recordset[0];
            const isMatch = await bcrypt.compare(password, user.Password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: parseInt(user.Id, 10), // Convert user.Id to a number (important!)
                    role: user.Role
                }
            };
            console.log("User ID in payload:", payload.user.id, typeof payload.user.id);

            const secretKey = "je2v!he6";
            jwt.sign(payload, secretKey, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

        } catch (err) {
            console.error("Error in loginUser:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getUserById: async (req, res) => {
        console.log("req.user (start of getProfile):", req.user); // Log req.user
        console.log("req.user.id (start of getProfile):", req.user.id, typeof req.user.id);
    
        const userId = req.user.id; // Access from req.user

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('Id', mssql.Int, userId); // Consistent with database

            const result = await request.query('SELECT * FROM Users WHERE Id = @Id'); // Consistent with database

            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result.recordset[0]);

        } catch (err) {
            console.error("Error in getUserById:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getProfile: async (req, res) => {
        console.log("req.user (start of getProfile):", req.user); // Log req.user
        console.log("req.user.id (start of getProfile):", req.user.id, typeof req.user.id);
    
        const userId = req.user.id; // Access from req.user

        if (isNaN(userId)) {  // Check for NaN after accessing.
            return res.status(400).json({ message: 'Invalid user ID (NaN)' });
        }

        if (!userId) { // Check for undefined or null
            return res.status(401).json({ message: 'Unauthorized (no userId)' });
        }
        
        console.log("userId:", userId, typeof userId);

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('Id', mssql.Int, userId);
    
            console.log("SQL Query:", request.query.text);

            const result = await request.query('SELECT * FROM Users WHERE Id = CAST(@Id AS INT)'); // The crucial change

            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = User.fromDb(result.recordset[0]);
            res.json(user);

        } catch (err) {
            console.error("Error in getProfile:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    addDeposit: async (req, res) => {
        const userId = req.user.id;
        const { deposit } = req.body;
    
        const allowedCoins = [5, 10, 20, 50, 100];
    
        if (typeof deposit !== 'number' || isNaN(deposit) || deposit < 0) {
            return res.status(400).json({ message: 'Invalid deposit amount: Must be a number and greater than or equal to zero.' });
        }
    
        if (!allowedCoins.includes(deposit)) {
            return res.status(400).json({ message: 'Invalid coin value. Allowed coins are: 5, 10, 20, 50, 100.' });
        }
    
        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('Id', mssql.Int, userId);
            request.input('deposit', mssql.Int, deposit);
    
            const result = await request.query('UPDATE Users SET Deposit = Deposit + @deposit WHERE Id = @Id; SELECT * FROM Users WHERE Id = @Id');
    
            const updatedUser = User.fromDb(result.recordset[0]);
            res.json({ message: 'Deposit added successfully', user: updatedUser });
    
        } catch (err) {
            console.error("Error in addDeposit:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    resetDeposit: async (req, res) => {
        const userId = req.user.id; // Access with lowercase 'id'
        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('Id', mssql.Int, userId);

            const result = await request.query('UPDATE Users SET Deposit = 0 WHERE Id = @Id; SELECT * FROM Users WHERE Id = @Id');

            const updatedUser = User.fromDb(result.recordset[0]);
            res.json({ message: 'Deposit returned successfully', user: updatedUser });

        } catch (err) {
            console.error("Error in resetDeposit:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getMyProducts: async (req, res) => {
        const userId = req.user.id;
        const role = req.user.role; // Get the user's role from the token

        if (role === 'buyer') {
            return res.status(403).json({ message: "Your account is not business" });
        }

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('Id', mssql.Int, userId);

            const query = `
            SELECT 
                p.Id AS ProductId,  -- Assuming you have an 'Id' column (primary key)
                p.ProductName AS ProductName,
                p.AmountAvailable AS ProductQuantity,  -- Map to ProductQuantity
                p.Cost AS ProductPrice,  -- Map to ProductPrice
                p.SellerId AS ProductSellerId
            FROM Products p
            WHERE p.SellerId = CAST(@Id AS INT)`;
            console.log("SQL Query:", query);

            const result = await request.query(query);

            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'No products found for this seller' }); // Indicate no products
            }

            res.json(result.recordset); // Return the products directly

        } catch (err) {
            console.error("Error in getMyProducts:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },
    purchaseProducts: async (req, res) => {
        const userId = req.user.id;
        const { products } = req.body;
    
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid product data.  Must be a non-empty array." });
        }
    
        let transaction;
    
        try {
            const pool = await poolPromise;
            transaction = new mssql.Transaction(pool);
            await transaction.begin();
            const request = new mssql.Request(transaction);
    
            // 1. Check User Deposit
            const userDepositResult = await request.query(`SELECT Deposit FROM Users WHERE Id = ${userId}`);
            if (userDepositResult.recordset.length === 0) {
                throw new Error("User not found.");
            }
            const userDeposit = userDepositResult.recordset[0].Deposit;
    
            let totalPrice = 0;
    
            // 2. Iterate through products to calculate total price and check stock
            for (const product of products) {
                if (!product.id || !product.quantity || typeof product.quantity !== 'number' || product.quantity <= 0) {
                    throw new Error("Invalid product data in request. Must have id and quantity.");
                }
    
                const productDetails = await request.query(`SELECT Cost, AmountAvailable FROM Products WHERE Id = ${product.id}`);
                if (productDetails.recordset.length === 0) {
                    throw new Error(`Invalid product ID: ${product.id}`);
                }
                const cost = productDetails.recordset[0].Cost;
                const amountAvailable = productDetails.recordset[0].AmountAvailable;
    
                if (product.quantity > amountAvailable) {
                    throw new Error(`Insufficient stock for product ${product.id}`);
                }
    
                totalPrice += cost * product.quantity;
            }
    
            // 3. Check Sufficient Deposit
            if (userDeposit < totalPrice) {
                throw new Error("Insufficient deposit to complete the purchase.");
            }
    
            // 4. Update Inventory and Create Order (within the same transaction)
            for (const product of products) {
                const productDetails = await request.query(`SELECT AmountAvailable FROM Products WHERE Id = ${product.id}`);
                const amountAvailable = productDetails.recordset[0].AmountAvailable;
    
                if (product.quantity > amountAvailable) {
                    throw new Error(`Insufficient stock for product ${product.id}`);
                }
    
                await request.query(`UPDATE Products SET AmountAvailable = AmountAvailable - ${product.quantity} WHERE Id = ${product.id}`);
            }
    
            const orderResult = await request.query(`INSERT INTO Orders (UserId, OrderDate, TotalPrice) VALUES (${userId}, GETDATE(), ${totalPrice}); SELECT SCOPE_IDENTITY() AS OrderId;`);
            const orderId = orderResult.recordset[0].OrderId;
    
            for (const product of products) {
                const productCostDetails = await request.query(`SELECT Cost FROM Products WHERE Id = ${product.id}`);
                const cost = productCostDetails.recordset[0].Cost; // Get cost from database
    
                await request.query(`INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES (${orderId}, ${product.id}, ${product.quantity}, ${cost})`);
            }
    
            // 5. Update User Deposit
            await request.query(`UPDATE Users SET Deposit = Deposit - ${totalPrice} WHERE Id = ${userId}`);
    
            await transaction.commit();
    
            res.status(201).json({ message: "Order created successfully", orderId });
    
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            console.error("Error in purchase:", error);
            res.status(500).json({ message: error.message || "Purchase failed" });
        }
    },       // Other useful methods can go here
};

module.exports = UserController;