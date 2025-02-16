// filepath: /Users/pante/Repos/Git_Repositories/LocalScope/vending-machine-app/client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await AuthService.register(username, password, role);
            alert('User registered successfully');
        } catch (err) {
            console.error(err);
            alert('Error registering user');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;