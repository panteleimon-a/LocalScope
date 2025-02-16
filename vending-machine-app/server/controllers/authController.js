const User = require('../models/User'); // Import your User model (if using a database)
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }); // Replace with your actual user retrieval method.  Example with Mongoose/MongoDB
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(payload, 'je2v!he6', { expiresIn: '1h' }, (err, token) => { // Replace with your actual secret
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
      let user = new User({
          username,
          password,
          role
      });
      await user.save();
      res.json({ id: user.id });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
}

const logout = (req, res) => {
  //In a real application, you might want to invalidate the JWT on the server side (e.g., using a blacklist).
  res.json({message: "Logged out"}); // For this example, we just send a message.
}

module.exports = { login, register, logout };