import React from 'react';
import MinimalTemplate from './components/MinimalTemplate';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';

const App = () => {
  return (
    <div>
        <NavigationBar/>
        <HomePage />
    </div>
  );
};

export default App;
