// filepath: /Users/pante/Repos/Git_Repositories/LocalScope/vending-machine-app/client/src/pages/HomePage.js
import React from 'react';
import ProductList from '../components/ProductList';

const HomePage = () => {
    return (
        <div>
            <h2>Home Page</h2>
            <p>Welcome to the Vending Machine App!</p>
            <ProductList />
        </div>
    );
};

export default HomePage;