import axios from 'axios';

const API_URL = 'http://localhost:3000/products/';

const getAllProducts = () => {
    return axios.get(API_URL);
};

const createProduct = (productName, amountAvailable, cost, sellerId) => {
    return axios.post(API_URL, {
        productName,
        amountAvailable,
        cost,
        sellerId
    });
};

const updateProduct = (id, productName, amountAvailable, cost) => {
    return axios.put(`${API_URL}${id}`, {
        productName,
        amountAvailable,
        cost
    });
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}${id}`);
};

export default {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};