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
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = productManager.getCartById(cartId);

    if (cart) {
        const cartProducts = cart.products;
        res.json(cartProducts);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Add a product to a cart
router.post('/:cid/products/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    productManager.addProductToCart(cartId, productId);
    res.json({ message: 'Product added to cart successfully' });
});

// Update a cart
router.put('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const updatedCart = req.body;

    const cartIndex = productManager.getCarts().findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
        productManager.getCarts()[cartIndex] = { ...productManager.getCarts()[cartIndex], ...updatedCart };
        res.json(productManager.getCarts()[cartIndex]);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Delete a cart
router.delete('/:cid', (req, res) => {
    const cartId = req.params.cid;

    const cartIndex = productManager.getCarts().findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
        const deletedCart = productManager.getCarts().splice(cartIndex, 1);
        res.json(deletedCart[0]);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

module.exports = router;
