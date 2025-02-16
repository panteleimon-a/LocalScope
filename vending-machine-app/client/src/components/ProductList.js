// filepath: /Users/pante/Repos/Git_Repositories/LocalScope/vending-machine-app/client/src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import ProductService from '../services/ProductService';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.productName} - ${product.cost} (Available: {product.amountAvailable})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;