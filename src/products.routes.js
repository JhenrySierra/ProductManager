const express = require('express');
const router = express.Router();
const ProductManager = require('./productManagement');

const productManager = new ProductManager();
const products = require('./products.json');

// Retrieve all products
router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const product = productManager.getProductById(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add a new product
router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

// Update a product
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    const productIndex = products.findIndex((product) => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Delete a product
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const deleted = productManager.deleteProduct(productId);

    if (deleted) {
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;
