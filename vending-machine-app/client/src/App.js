import React, { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [deposit, setDeposit] = useState(0);
  const [newProduct, setNewProduct] = useState({ productName: '', cost: '', amountAvailable: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [registerData, setRegisterData] = useState({ username: '', password: '', deposit: 0, role: 'buyer' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role === 'buyer') {
        fetchDeposit();
      }
    }
    fetchProducts();
  }, []);

  const fetchDeposit = async () => {
    // ... (same as before)
  };

  const login = async (username, password) => {
    // ... (same as before)
  };

  const register = async () => {
    // ... (same as before)
  };

  const logout = () => {
    // ... (same as before)
  };

  const fetchProducts = async () => {
    // ... (same as before)
  };

  const addProduct = async () => {
    // ... (same as before)
  };

  const buyProduct = async (productId, amount) => {
    // ... (same as before)
  };

  const depositCoins = async (amount) => {
    // ... (same as before)
  };

  const resetDeposit = async () => {
    // ... (same as before)
  };


  if (!user) {
    return (
      <div>
        {/* ... (Login/Register form - same as before) */}
      </div>
    );
  }

  return (
    <div>
      <h1>Vending Machine</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {user && <button onClick={logout}>Logout</button>}

      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.productName} - ${product.cost} (Available: {product.amountAvailable})
            {user && user.role === 'buyer' && (
              <button onClick={() => buyProduct(product._id, 1)}>Buy</button>
            )}
          </li>
        ))}
      </ul>

      {user && user.role === 'seller' && (
        <div>
          <h2>Add Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cost"
            value={newProduct.cost}
            onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount Available"
            value={newProduct.amountAvailable}
            onChange={(e) => setNewProduct({ ...newProduct, amountAvailable: e.target.value })}
          />
          <button onClick={addProduct}>Add</button>
        </div>
      )}

      {user && user.role === 'buyer' && (
        <div>
          <h2>Deposit</h2>
          <button onClick={() => depositCoins(5)}>5 Cent</button>
          <button onClick={() => depositCoins(10)}>10 Cent</button>
          <button onClick={() => depositCoins(20)}>20 Cent</button>
          <button onClick={() => depositCoins(50)}>50 Cent</button>
          <button onClick={() => depositCoins(100)}>100 Cent</button>
          <p>Current Deposit: {deposit / 100} €</p>
          <button onClick={resetDeposit}>Reset Deposit</button>
        </div>
      )}
    </div>
  );
};

export default App;