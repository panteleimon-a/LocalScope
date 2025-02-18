import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [deposit, setDeposit] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, [token]);

  const handleDeposit = (e) => {
    e.preventDefault();
    const validCoins = [5, 10, 20, 50, 100];
    const depositAmount = parseInt(deposit, 10);

    if (!validCoins.includes(depositAmount)) {
      setError('Invalid coin. Please insert 5, 10, 20, 50, or 100 coins.');
      setMessage('');
      return;
    }

    fetch('http://localhost:3000/user/profile/deposit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ deposit: depositAmount })
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Deposit added successfully.');
        setError('');
        setProfile(prevProfile => ({
          ...prevProfile,
          Deposit: prevProfile.Deposit + depositAmount
        }));
      })
      .catch(err => {
        setError('Failed to add deposit.');
        setMessage('');
        console.error(err);
      });
  };

  const handleResetDeposit = () => {
    fetch('http://localhost:3000/user/profile/reset', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Deposit reset successfully.');
        setError('');
        setProfile(prevProfile => ({
          ...prevProfile,
          Deposit: 0
        }));
      })
      .catch(err => {
        setError('Failed to reset deposit.');
        setMessage('');
        console.error(err);
      });
  };

  return (
    <div>
      <h1>Profile</h1>
      {profile ? (
        <div>
          <p>Id: {profile.Id}</p>
          <p>Username: {profile.Username}</p>
          <p>Role: {profile.Role}</p>
          <p>Deposit: {profile.Deposit}</p>
          <form onSubmit={handleDeposit}>
            <input
              type="number"
              placeholder="Deposit amount"
              value={deposit}
              onChange={e => setDeposit(e.target.value)}
            />
            <button type="submit">Add Deposit</button>
          </form>
          <button onClick={handleResetDeposit}>Reset Deposit</button>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;