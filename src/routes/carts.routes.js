// carts.routes.js

const express = require('express');
const router = express.Router();
const CartModel = require('../daos/mongodb/models/cart.model');
const ProductModel = require('../daos/mongodb/models/product.model');
const mongoose = require('mongoose');



// Retrieve all carts
router.get('/', async (req, res) => {
    try {
        const allCarts = await CartModel.find();
        res.json(allCarts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new cart
router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const createdCart = await CartModel.create(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retrieve a cart by ID
router.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        // Use the .populate() method to replace the product IDs with the actual product documents
        const cart = await CartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Extract only the products array from the cart
        const cartProducts = cart.products;

        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a product to a cart
router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        // Validate the ObjectId format of the product ID
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        // Validate that the quantity is a positive integer
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity. Must be a positive integer' });
        }

        // Find the cart by its ID
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product in the cart by its ID
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            // If the product is not in the cart, add it to the cart with the specified quantity
            cart.products.push({ product: productId, quantity });
        } else {
            // If the product is already in the cart, update its quantity
            cart.products[productIndex].quantity = quantity;
        }

        // Save the updated cart
        await cart.save();
        res.json({ message: 'Product added/updated in the cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a cart
router.put('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const updatedCart = req.body;
        const cart = await CartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update the quantity of a product in the cart
router.put('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product index in the cart's products array
        const productIndex = cart.products.indexOf(productId);

        // If the product is not in the cart, return an error
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        // Update the product quantity
        cart.products[productIndex].quantity = quantity;

        await cart.save();
        res.json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a product from a cart
router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Find the cart by its ID
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product in the cart by its ID
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();
        res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete all products from the cart
router.delete('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await CartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove all products from the cart
        cart.products = [];

        await cart.save();
        res.json({ message: 'All products removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
