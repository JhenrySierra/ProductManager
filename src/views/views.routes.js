const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controllers.js');

// View to display all products
router.get('/', async (req, res, next) => {
    try {
        const products = await productController.getAll(req);
        res.render('products', { payload: products });
    } catch (error) {
        next(error);
    }
});

// View to display a single product
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productController.getById(id);
        res.render('product', { product });
    } catch (error) {
        next(error);
    }
});

// Add other view routes as needed

module.exports = router;
