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

            const userId = result.recordset[0].id;
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
                    id: user.Id, // Correct: user.Id (capital 'I')
                    role: user.Role // Correct: user.Role (capital 'R')
                } 
            };

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
        const userId = req.params.id;

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('id', mssql.Int, userId);

            const result = await request.query('SELECT * FROM Users WHERE Id = @id');

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
        const userId = req.user.id; // Get user ID from the token

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('id', mssql.Int, userId);

            const result = await request.query('SELECT * FROM Users WHERE Id = @id');

            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'User not found' }); // Should not happen, but good to check
            }

            const user = User.fromDb(result.recordset[0]); // Use User model
            res.json(user); // Send the User object

        } catch (err) {
            console.error("Error in getProfile:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    addDeposit: async (req, res) => {
        const userId = req.user.id;
        const { deposit } = req.body; // Get deposit amount from request body

        if (typeof deposit !== 'number' || isNaN(deposit) || deposit < 0) {
            return res.status(400).json({ message: 'Invalid deposit amount' });
        }

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('id', mssql.Int, userId);
            request.input('deposit', mssql.Int, deposit); // Or mssql.Decimal if needed

            const result = await request.query('UPDATE Users SET Deposit = Deposit + @deposit WHERE Id = @id; SELECT * FROM Users WHERE Id = @id'); // Update and get the updated user

            const updatedUser = User.fromDb(result.recordset[0]);
            res.json({ message: 'Deposit added successfully', user: updatedUser });

        } catch (err) {
            console.error("Error in addDeposit:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    resetDeposit: async (req, res) => {
        const userId = req.user.id;

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('id', mssql.Int, userId);

            const result = await request.query('UPDATE Users SET Deposit = 0 WHERE Id = @id; SELECT * FROM Users WHERE Id = @id');

            const updatedUser = User.fromDb(result.recordset[0]);
            res.json({ message: 'Deposit reset successfully', user: updatedUser });

        } catch (err) {
            console.error("Error in resetDeposit:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },
    // ... other controller methods if needed ...
};

module.exports = UserController;