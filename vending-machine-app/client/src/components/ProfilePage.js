import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [deposit, setDeposit] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/user/profile', {
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

    fetch('/user/profile/deposit', {
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
    fetch('/user/profile/reset', {
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
          {/* Deposit graphic bar */}
          <div style={{ margin: '16px 0' }}>
            <span style={{ fontWeight: 'bold' }}>Deposit:</span>
            <div style={{
              background: '#eee',
              borderRadius: 8,
              height: 24,
              width: 250,
              marginTop: 4,
              position: 'relative',
              boxShadow: '0 1px 2px #ddd inset'
            }}>
              <div style={{
                background: '#4caf50',
                width: `${Math.min(profile.Deposit, 200) / 2}%`, // scale: 100 = 50%, 200 = 100%
                height: '100%',
                borderRadius: 8,
                transition: 'width 0.3s'
              }} />
              <span style={{
                position: 'absolute',
                left: 12,
                top: 2,
                color: '#222',
                fontWeight: 'bold'
              }}>
                {profile.Deposit} credits
              </span>
            </div>
          </div>
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