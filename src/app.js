const express = require('express');
const path = require('path');
const ProductManager = require('./productManagement');

const app = express();
const port = 8080;

const productManager = new ProductManager();

app.get('/products', (req, res) => {
    const limit = req.query.limit; // Get the value of the "limit" query parameter

    // Read the products using the `getProducts()` method from the `ProductManager` instance
    const products = productManager.getProducts();

    // Check if a limit was provided
    if (limit) {
        const limitedProducts = products.slice(0, limit); // Get only the specified number of products
        res.json(limitedProducts);
    } else {
        res.json(products);
    }
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid); // Get the product ID from req.params as an integer

    // Get the requested product using the getProductById() method from the ProductManager instance
    const product = productManager.getProductById(productId);

    // Check if the product was found
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
