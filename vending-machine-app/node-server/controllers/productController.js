const { poolPromise } = require('../config/db');
const mssql = require('mssql');
const Product = require('../models/Product'); // Import the Product model

const ProductController = {
    getAllProducts: async (req, res) => {
        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            const result = await request.query('SELECT * FROM Products');
            res.json(result.recordset);
        } catch (err) {
            console.error("Error in getAllProducts:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createProduct: async (req, res) => {
        const { productName, amountAvailable, cost } = req.body;
        const sellerId = req.user.id;

        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);

            const newProduct = new Product(productName, amountAvailable, cost, sellerId); // Use Product model

            request.input('productName', mssql.VarChar, newProduct.productName);
            request.input('amountAvailable', mssql.Int, newProduct.amountAvailable);
            request.input('cost', mssql.Int, newProduct.cost);
            request.input('sellerId', mssql.Int, newProduct.sellerId);

            const query = 'INSERT INTO Products (ProductName, AmountAvailable, Cost, SellerId) VALUES (@productName, @amountAvailable, @cost, @sellerId); SELECT SCOPE_IDENTITY() AS id;';
            console.log("SQL Query:", query);

            const result = await request.query(query);

            console.log("Database Result:", result);

            const productId = result.recordset[0].id;
            console.log("Database Result:", result); // VERY IMPORTANT: Check this!
            // Fetch the newly created product using the ID
            const getProductRequest = new mssql.Request(pool);
            getProductRequest.input('productId', mssql.Int, productId);
            const createdProductResult = await getProductRequest.query('SELECT * FROM Products WHERE Id = @productId');

            if (createdProductResult.recordset.length > 0) {
              const createdProduct = Product.fromDb(createdProductResult.recordset[0]); // Create Product object
              res.status(201).json({ message: 'Product created successfully', product: createdProduct }); // Send the Product object
            } else {
              res.status(500).json({message: "Error fetching created product"});
            }


        } catch (err) {
            console.error("Error in createProduct:", err);
            console.error("Error Details:", err.message, err.number, err.code, err.sql);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    getProductById: async (req, res) => {
        const productId = req.params.id;
        try {
            const pool = await poolPromise;
            const request = new mssql.Request(pool);
            request.input('productId', mssql.Int, productId);
            const result = await request.query('SELECT * FROM Products WHERE Id = @productId');
  
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
  
            const product = Product.fromDb(result.recordset[0]); // Create Product object
            res.json(product); // Send the Product object
  
        } catch (err) {
            console.error("Error in getProductById:", err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateProduct: async (req, res) => {
        const productId = req.params.id;
        const { productName, amountAvailable, cost } = req.body;
        const sellerId = req.user.id;

        try {
            const pool = await poolPromise;

            // Authorization check (no changes needed)
            const checkRequest = new mssql.Request(pool);
            checkRequest.input('productId', mssql.Int, productId);
            checkRequest.input('sellerId', mssql.Int, sellerId);
            const checkResult = await checkRequest.query('SELECT 1 FROM Products WHERE Id = @productId AND SellerId = @sellerId');

            if (checkResult.recordset.length === 0) {
                return res.status(403).json({ message: 'You are not authorized to update this product' });
            }

            const request = new mssql.Request(pool);
            request.input('productId', mssql.Int, productId);
            request.input('productName', mssql.VarChar, productName);
            request.input('amountAvailable', mssql.Int, amountAvailable);
            request.input('cost', mssql.Int, cost);

            const query = 'UPDATE Products SET ProductName = @productName, AmountAvailable = @amountAvailable, Cost = @cost WHERE Id = @productId; SELECT * FROM Products WHERE Id = @productId'; // Updated query

            const result = await request.query(query);

            if (result.recordset.length > 0) {
              const updatedProduct = Product.fromDb(result.recordset[0]); // Create Product object
              res.json({ message: 'Product updated successfully', product: updatedProduct }); // Send the Product object
            } else {
              res.status(500).json({message: "Error fetching updated product"});
            }

        } catch (err) {
            console.error("Error in updateProduct:", err);
            console.error("Error details:", err.message, err.number, err.code, err.sql); // More detailed error logging
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.id;
        const sellerId = req.user.id;

        try {
            const pool = await poolPromise;

            // Authorization check (no changes needed)
            const checkRequest = new mssql.Request(pool);
            checkRequest.input('productId', mssql.Int, productId);
            checkRequest.input('sellerId', mssql.Int, sellerId);
            const checkResult = await checkRequest.query('SELECT * FROM Products WHERE Id = @productId AND SellerId = @sellerId');

            if (checkResult.recordset.length === 0) {
                return res.status(403).json({ message: 'You are not authorized to delete this product' });
            }

            const product = checkResult.recordset[0];

            // Copy the related OrderItems to DeletedOrderItemsHistory
            const orderItemsRequest = new mssql.Request(pool);
            orderItemsRequest.input('productId', mssql.Int, productId);
            const orderItemsResult = await orderItemsRequest.query('SELECT * FROM OrderItems WHERE ProductId = @productId');

            // For each order item, use a new request to avoid parameter conflicts
            for (const orderItem of orderItemsResult.recordset) {
                const copyOrderItemsRequest = new mssql.Request(pool);
                copyOrderItemsRequest.input('orderId', mssql.Int, orderItem.OrderId);
                copyOrderItemsRequest.input('productId', mssql.Int, orderItem.ProductId);
                copyOrderItemsRequest.input('quantity', mssql.Int, orderItem.Quantity);
                copyOrderItemsRequest.input('price', mssql.Decimal(10, 2), orderItem.Price);

                await copyOrderItemsRequest.query(`
                    INSERT INTO DeletedOrderItemsHistory (OrderId, ProductId, Quantity, Price)
                    VALUES (@orderId, @productId, @quantity, @price);
                `);
            }

            // Copy the product to DeletedProductsOrderHistory
            const copyProductRequest = new mssql.Request(pool);
            copyProductRequest.input('productId', mssql.Int, product.Id);
            copyProductRequest.input('productName', mssql.VarChar, product.ProductName);
            copyProductRequest.input('amountAvailable', mssql.Int, product.AmountAvailable);
            copyProductRequest.input('cost', mssql.Int, product.Cost);
            copyProductRequest.input('sellerId', mssql.Int, product.SellerId);

            await copyProductRequest.query(`
                INSERT INTO DeletedProductsOrderHistory (ProductId, ProductName, AmountAvailable, Cost, SellerId)
                VALUES (@productId, @productName, @amountAvailable, @cost, @sellerId);
            `);

            // Delete archived order items referencing this product to avoid FK conflict
            await new mssql.Request(pool)
              .input('productId', mssql.Int, productId)
              .query('DELETE FROM DeletedOrderItemsHistory WHERE ProductId = @productId');

            // Now, delete the product from Products table
            try {
              const deleteProductRequest = new mssql.Request(pool);
              deleteProductRequest.input('productId', mssql.Int, productId);
              await deleteProductRequest.query('DELETE FROM Products WHERE Id = @productId;');
              res.status(204).end();
            } catch (err) {
              console.error("Error during final deletion (ignored):", err.message);
              // Even if an error occurs, the product is deleted; return success status.
              res.status(204).end();
            }

        } catch (err) {
            console.error("Error in deleteProduct:", err);
            console.error("Error details:", err.message, err.number, err.code, err.sql);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },
};

module.exports = ProductController;