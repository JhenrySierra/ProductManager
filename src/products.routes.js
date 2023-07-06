// product.routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('./productManagement');

const productManager = new ProductManager();

// Retrieve all products
router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Add a new product
router.post('/', (req, res) => {
    const { productName } = req.body;
    productManager.addProduct(productName);
    io.emit('productAdded', productName);
    res.redirect('/realtimeproducts');
});

// Delete a product
router.delete('/:productId', (req, res) => {
    const { productId } = req.params;
    const deletedProduct = productManager.deleteProduct(productId);
    if (deletedProduct) {
        io.emit('productDeleted');
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;
