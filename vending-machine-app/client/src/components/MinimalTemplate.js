import React from 'react';
import logo from '../logo.svg';

const MinimalTemplate = ({
  children,
  onNavigate,
  token,
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  loginError,
  handleLogin,
  handleTerminateSessions,
  regUsername,
  setRegUsername,
  regPassword,
  setRegPassword,
  regRole,
  setRegRole,
  regError,
  handleRegister,
  handleLogout,
  search,
  setSearch
}) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif', background: '#fafbfc', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#fff', padding: '12px 0', borderBottom: '1px solid #e5e5e7' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: 32, marginRight: 20, filter: 'grayscale(1) brightness(0.7)' }}
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e5e5e7',
              borderRadius: 8,
              fontSize: 15,
              background: '#f5f5f7',
              marginRight: 20,
              outline: 'none'
            }}
          />
          <nav>
            <button onClick={() => onNavigate('home')} style={{ margin: '0 8px', color: '#222', background: 'none', border: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Home</button>
            {token ? (
              <>
                <button onClick={() => onNavigate('profile')} style={{ margin: '0 8px', color: '#222', background: 'none', border: 'none', fontWeight: 400, fontSize: 15, cursor: 'pointer' }}>Profile</button>
                <button onClick={() => onNavigate('myproducts')} style={{ margin: '0 8px', color: '#222', background: 'none', border: 'none', fontWeight: 400, fontSize: 15, cursor: 'pointer' }}>My Products</button>
                <button onClick={handleLogout} style={{ margin: '0 8px', color: '#222', background: 'none', border: 'none', fontWeight: 400, fontSize: 15, cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <form onSubmit={handleLogin} style={{ display: 'inline-block', marginRight: 8 }}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    style={{ marginRight: 4, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e5e7', fontSize: 14 }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ marginRight: 4, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e5e7', fontSize: 14 }}
                  />
                  <button type="submit" style={{ padding: '2px 10px', borderRadius: 4, border: 'none', background: '#eee', fontSize: 14, cursor: 'pointer' }}>Login</button>
                  {loginError && (
                    <div>
                      <p style={{ color: 'red', margin: 0 }}>{loginError}</p>
                      {loginError === 'There is already an active session using your account.' && (
                        <button type="button" onClick={handleTerminateSessions} style={{ padding: '2px 10px', borderRadius: 4, border: 'none', background: '#eee', fontSize: 14, cursor: 'pointer' }}>Terminate All Sessions</button>
                      )}
                    </div>
                  )}
                </form>
                <form onSubmit={handleRegister} style={{ display: 'inline-block' }}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    style={{ marginRight: 4, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e5e7', fontSize: 14 }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{ marginRight: 4, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e5e7', fontSize: 14 }}
                  />
                  <select value={regRole} onChange={(e) => setRegRole(e.target.value)} style={{ marginRight: 4, padding: '2px 6px', borderRadius: 4, border: '1px solid #e5e5e7', fontSize: 14 }}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                  <button type="submit" style={{ padding: '2px 10px', borderRadius: 4, border: 'none', background: '#eee', fontSize: 14, cursor: 'pointer' }}>Register</button>
                  {regError && <p style={{ color: 'red', margin: 0 }}>{regError}</p>}
                </form>
              </>
            )}
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main style={{ maxWidth: 900, margin: '32px auto', background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 2px 8px #f0f1f3' }}>
        {children}
      </main>
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: 14, background: '#fff', borderTop: '1px solid #e5e5e7', marginTop: 40, color: '#888', fontSize: 14 }}>
        <span>© {new Date().getFullYear()} Demo Marketplace</span>
      </footer>
    </div>
  );
};

export default MinimalTemplate;
