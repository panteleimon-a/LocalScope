import React, { useState } from 'react';
import MinimalTemplate from './components/MinimalTemplate';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import MyProductsPage from './components/MyProductsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <MinimalTemplate>
      <NavigationBar onNavigate={handleNavigation} />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'myproducts' && <MyProductsPage />}
    </MinimalTemplate>
  );
};

export default App;
