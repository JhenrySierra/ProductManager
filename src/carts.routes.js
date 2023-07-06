// carts.routes.js

const express = require('express');
const router = express.Router();
const ProductManager = require('./productManagement');

const productManager = new ProductManager();

// Retrieve all carts
router.get('/', (req, res) => {
    const allCarts = productManager.getAllCarts();
    res.json(allCarts);
});

// Add a new cart
router.post('/', (req, res) => {
    const newCart = req.body;
    productManager.createCart(newCart);
    res.status(201).json(newCart);
});

// Retrieve a cart by ID
router.get('/:cartId', (req, res) => {
    const { cartId } = req.params;
    const cart = productManager.getCartById(cartId);
    if (cart) {
        const cartProducts = cart.products;
        res.json(cartProducts);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Add a product to a cart
router.post('/:cartId/products/:productId', (req, res) => {
    const { cartId, productId } = req.params;
    productManager.addProductToCart(cartId, productId);
    res.json({ message: 'Product added to cart successfully' });
});

// Update a cart
router.put('/:cartId', (req, res) => {
    const { cartId } = req.params;
    const updatedCart = req.body;
    const cartIndex = productManager.updateCart(cartId, updatedCart);
    if (cartIndex !== -1) {
        res.json(productManager.getAllCarts()[cartIndex]);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Delete a cart
router.delete('/:cartId', (req, res) => {
    const { cartId } = req.params;
    const deletedCart = productManager.deleteCart(cartId);
    if (deletedCart) {
        res.json(deletedCart);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

module.exports = router;
