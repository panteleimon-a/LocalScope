import axios from 'axios';

const API_URL = 'http://localhost:3000/';

const register = (username, password, role) => {
    return axios.post(API_URL + 'register', { username, password, role }, { headers: { 'Content-Type': 'application/json' } });
};

const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password }, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    return axios.post(API_URL + 'logout', {}, { headers: { 'Content-Type': 'application/json' } })
        .then(() => {
            localStorage.removeItem('user');
        });
};

export default {
    register,
    login,
    logout
};