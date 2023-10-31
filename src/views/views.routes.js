const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controllers.js');

// View to display all products
router.get('/', async (req, res, next) => {
    try {
        const responseData = await productController.getAll(req, res, next);
        res.render('products', responseData); // Render the 'products' view directly
    } catch (error) {
        next(error);
    }
});




// View to display a single product (not implemented yet)
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productController.getById(req, res, next);
        res.render('product', { product });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
