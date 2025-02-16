import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;