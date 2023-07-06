// server.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
const productRoutes = require('./products.routes');
const cartRoutes = require('./carts.routes');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.json());

// Load products data from JSON file
const products = require('./products.json');
const ProductManager = require('./productManagement');

const productManager = new ProductManager();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Render the real-time product view
app.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});

// WebSocket event handling
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Handle add product event
    socket.on('addProduct', (productName) => {
        productManager.addProduct(productName);
        io.emit('productAdded', productName);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Start the server
const port = 8080;
http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
