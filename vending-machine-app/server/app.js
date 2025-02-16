const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/user', userRoutes);
app.use('/products', productRoutes);

// ... (Deposit, Buy, Reset endpoints - likely in a separate controller/route file)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});