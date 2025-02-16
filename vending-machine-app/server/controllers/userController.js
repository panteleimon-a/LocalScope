const User = require('../models/User'); // Ensure consistent casing
const bcrypt = require('bcrypt'); // For password hashing (install: npm install bcrypt)
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the response
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // 10 is the salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword, // Store the hashed password
            role,
        });

        await user.save();

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, 'je2v!he6', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const logoutAllUsers = async (req, res) => {
    // In a real application, you might want to invalidate JWTs on the server-side (e.g., using a blacklist or database). This is complex and depends on your JWT strategy.
    // For this example, we'll just send a success message. The client-side should clear the token.
    res.json({ message: 'All sessions terminated.' });
};

module.exports = { getAllUsers, registerUser, logoutAllUsers };