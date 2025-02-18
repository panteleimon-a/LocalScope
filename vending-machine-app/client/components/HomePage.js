import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch products from backend
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);
  
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.length ? products.map(product => (
          <li key={product.id}>
            <strong>{product.productName}</strong> - Cost: {product.cost} - Available: {product.amountAvailable} - Seller: {product.sellerId}
          </li>
        )) : <li>No products available.</li>}
      </ul>
    </div>
  );
};

export default HomePage;
