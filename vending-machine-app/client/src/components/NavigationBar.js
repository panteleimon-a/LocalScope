import React, { useState, useEffect } from 'react';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Registration state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('buyer');
  const [regDeposit, setRegDeposit] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(data => {
        // Assume data.token is returned on successful login
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('token', data.token); // Store token for use in HomePage.js
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token'); // Fixed from postItem to getItem
    fetch('http://localhost:3000/user/logout', {
      method: 'POST', // Using POST request
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
         console.log(data.message);
         setToken(null);
         setIsLoggedIn(false);
         localStorage.removeItem('token');
      })
      .catch(err => {
         console.error(err);
         setToken(null);
         setIsLoggedIn(false);
         localStorage.removeItem('token');
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError(''); // reset previous error
    const body = {
      username: regUsername,
      password: regPassword,
      role: regRole
    };
    // Include deposit only if provided
    if (regDeposit !== '') {
      body.deposit = Number(regDeposit);
    }

    fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.message);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Registration successful', data);
        // Optionally, you might want to auto-login or notify the user.
      })
      .catch(err => setRegError(err.message));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ width: '100%' }}>
        {/* ...existing navigation elements... */}
      </div>
      <div style={{ width: '100%', textAlign: 'right' }}>
        {token ? (
          <div>
            <span>Logged in</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
              <select value={regRole} onChange={e => setRegRole(e.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
              <input
                type="number"
                placeholder="Deposit (optional)"
                value={regDeposit}
                onChange={e => setRegDeposit(e.target.value)}
              />
              <button type="submit">Register</button>
              {regError && <p style={{ color: 'red' }}>{regError}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
