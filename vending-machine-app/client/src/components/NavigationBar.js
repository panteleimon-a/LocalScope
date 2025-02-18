import React, { useState, useEffect } from 'react';

const NavigationBar = ({ onNavigate }) => {
  const [token, setToken] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('buyer');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (token) {
      setLoginError('User already signed-in');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'User already logged in') {
          setLoginError('There is already an active session using your account.');
        } else {
          throw new Error(errorData.message || 'Login failed');
        }
      } else {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setLoginUsername('');
        setLoginPassword('');
        setLoginError('');
        onNavigate('home');
      }
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleTerminateSessions = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to terminate sessions');
      }
      setLoginError('All active sessions have been terminated. Please log in again.');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regUsername, password: regPassword, role: regRole })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      setRegUsername('');
      setRegPassword('');
      setRegRole('buyer');
      setRegError('');
      onNavigate('home');
    } catch (err) {
      setRegError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    onNavigate('home');
  };

  return (
    <nav>
      <button onClick={() => onNavigate('home')}>Home</button>
      {token ? (
        <>
          <button onClick={() => onNavigate('profile')}>Profile</button>
          <button onClick={() => onNavigate('myproducts')}>My Products</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            {loginError && (
              <div>
                <p style={{ color: 'red' }}>{loginError}</p>
                {loginError === 'There is already an active session using your account.' && (
                  <button onClick={handleTerminateSessions}>Terminate All Sessions</button>
                )}
              </div>
            )}
          </form>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            <button type="submit">Register</button>
            {regError && <p style={{ color: 'red' }}>{regError}</p>}
          </form>
        </>
      )}
    </nav>
  );
};

export default NavigationBar;
