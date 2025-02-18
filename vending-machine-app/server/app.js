const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors'); // Import the cors package

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Enable CORS for all origins (or specify the origin) -  Crucial for different ports
app.use(cors({
    origin: 'http://localhost:3001' // Specify the origin (frontend URL)
}));

app.use('/user', userRoutes);
app.use('/products', productRoutes);

// ... (Deposit, Buy, Reset endpoints - likely in a separate controller/route file)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});