import React, { useEffect, useState } from 'react';

const HomePage = ({ search = '' }) => {
  const [products, setProducts] = useState([]);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(product => ({
          Id: product.id ?? product.Id,
          ProductName: product.productName ?? product.ProductName,
          Cost: product.cost ?? product.Cost,
          AmountAvailable: product.amountAvailable ?? product.AmountAvailable
        }));
        setProducts(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  const handleBuy = (productId) => {
    setPurchaseError('');
    setPurchaseSuccess('');
    if (!token) {
      setPurchaseError('Please login to place your order.');
      return;
    }
    fetch('/user/purchase', {
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
        {products
          .filter(product =>
            product.ProductName.toLowerCase().includes(search.toLowerCase())
          )
          .map(product => (
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
