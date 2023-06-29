const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

// Load products and carts data from JSON files
const products = require('./products.json');
const carts = require('./carts.json');
const ProductManager = require('./productManagement');

const productManager = new ProductManager();

// Retrieve all products
app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    // Get the requested product using the getProductById() method from the ProductManager instance
    const product = productManager.getProductById(productId);

    // Check if the product was found
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add a new product
app.post('/products', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

// Update a product
app.put('/products/:pid', (req, res) => {
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
app.delete('/products/:pid', (req, res) => {
    const productId = req.params.pid;
    const deleted = productManager.deleteProduct(productId);

    if (deleted) {
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Retrieve all carts
app.get('/carts', (req, res) => {
    const allCarts = productManager.getAllCarts();
    res.json(allCarts);
});

// Add a new cart
app.post('/carts', (req, res) => {
    const newCart = req.body;
    productManager.createCart(newCart);
    res.status(201).json(newCart);
});

// Retrieve a cart by ID
app.get('/carts/:cid', (req, res) => {
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
app.post('/carts/:cid/products/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    productManager.addProductToCart(cartId, productId);
    res.json({ message: 'Product added to cart successfully' });
});

// Update a cart
app.put('/carts/:cid', (req, res) => {
    const cartId = req.params.cid;
    const updatedCart = req.body;

    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
        carts[cartIndex] = { ...carts[cartIndex], ...updatedCart };
        res.json(carts[cartIndex]);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Delete a cart
app.delete('/carts/:cid', (req, res) => {
    const cartId = req.params.cid;

    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
        const deletedCart = carts.splice(cartIndex, 1);
        res.json(deletedCart[0]);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
