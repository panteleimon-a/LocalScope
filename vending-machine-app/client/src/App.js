import React, { useState, useEffect } from 'react';
import MinimalTemplate from './components/MinimalTemplate';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import MyProductsPage from './components/MyProductsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('buyer');
  const [regError, setRegError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (token) {
      setLoginError('User already signed-in');
      return;
    }
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        setLoginError(`Server error: ${text}`);
        return;
      }
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
        setCurrentPage('home');
      }
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleTerminateSessions = async () => {
    try {
      const response = await fetch('/user/logout', {
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
      const response = await fetch('/user', {
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
      setCurrentPage('home');
    } catch (err) {
      setRegError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentPage('home');
  };

  return (
    <MinimalTemplate
      onNavigate={handleNavigation}
      token={token}
      loginUsername={loginUsername}
      setLoginUsername={setLoginUsername}
      loginPassword={loginPassword}
      setLoginPassword={setLoginPassword}
      loginError={loginError}
      handleLogin={handleLogin}
      handleTerminateSessions={handleTerminateSessions}
      regUsername={regUsername}
      setRegUsername={setRegUsername}
      regPassword={regPassword}
      setRegPassword={setRegPassword}
      regRole={regRole}
      setRegRole={setRegRole}
      regError={regError}
      handleRegister={handleRegister}
      handleLogout={handleLogout}
      search={search}
      setSearch={setSearch}
    >
      {currentPage === 'home' && <HomePage search={search} />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'myproducts' && <MyProductsPage />}
    </MinimalTemplate>
  );
};

export default App;
