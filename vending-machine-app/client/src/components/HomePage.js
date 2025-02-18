import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleBuy = (productId) => {
    setPurchaseError('');
    setPurchaseSuccess('');
    if (!token) {
      setPurchaseError('Please login to place your order.');
      return;
    }
    fetch('http://localhost:3000/user/purchase', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ products: [{ id: productId, quantity: 1 }] })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Purchase failed');
        }
        setPurchaseSuccess('Purchase successful! Order ID: ' + data.orderId);
      })
      .catch(err => setPurchaseError(err.message));
  };

  return (
    <div>
      <h1>Products</h1>
      {purchaseError && <p style={{ color: 'red' }}>{purchaseError}</p>}
      {purchaseSuccess && <p style={{ color: 'green' }}>{purchaseSuccess}</p>}
      <ul>
        {products.map(product => (
          <li key={product.Id}>
            {product.ProductName} - $ {product.Cost} (Available: {product.AmountAvailable})
            <button onClick={() => handleBuy(product.Id)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
