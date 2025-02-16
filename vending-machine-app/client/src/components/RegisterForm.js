import React, { useState } from 'react';
import AuthService from '../services/AuthService';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await AuthService.register(username, password, role);
      console.log('Registered:', data);
      setSuccess('Registration successful!');
      // ...handle further success (e.g., redirect to login)...
    } catch (err) {
      console.error('Error registering user', err);
      setError('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="" disabled>Select Role</option>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
