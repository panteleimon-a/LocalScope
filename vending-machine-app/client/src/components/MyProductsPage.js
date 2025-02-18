import React, { useEffect, useState } from 'react';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState('');
  const [amountAvailable, setAmountAvailable] = useState('');
  const [cost, setCost] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/user/profile/myproducts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setProducts(data);
        }
      })
      .catch(err => {
        setError('Failed to fetch products.');
        console.error(err);
      });
  }, [token]);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    fetch('http://localhost:3000/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productName,
        amountAvailable: parseInt(amountAvailable, 10),
        cost: parseInt(cost, 10)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setMessage('Product created successfully.');
          setProducts([...products, data]);
          setProductName('');
          setAmountAvailable('');
          setCost('');
        }
      })
      .catch(err => {
        setError('Failed to create product.');
        console.error(err);
      });
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:3000/products/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 204) {
          return {}; // No content
        }
        return res.json();
      })
      .then(data => {
        // If data.message exists, treat it as an error message, otherwise, deletion was successful.
        if (data.message) {
          setError(data.message);
        } else {
          setMessage('Product deleted successfully.');
          setProducts(products.filter(product => product.ProductId !== productId));
        }
      })
      .catch(err => {
        setError('Failed to delete product.');
        console.error(err);
      });
  };

  return (
    <div>
      <h1>My Products</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <ul>
        {products.map(product => (
          <li key={product.ProductId}>
            {product.ProductName} - $ {product.ProductPrice} (Available: {product.ProductQuantity})
            <button onClick={() => handleDeleteProduct(product.ProductId)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Create Product</h2>
      <form onSubmit={handleCreateProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount Available"
          value={amountAvailable}
          onChange={e => setAmountAvailable(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={e => setCost(e.target.value)}
          required
        />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default MyProductsPage;