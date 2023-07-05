const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

// Load products data from JSON file
const products = require('./products.json');
const ProductManager = require('./productManagement');

const productManager = new ProductManager();

// Routes
const productRoutes = require('./products.routes');
const cartRoutes = require('./carts.routes');

// Product routes
app.use('/api/products', productRoutes);

// Cart routes
app.use('/api/carts', cartRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
