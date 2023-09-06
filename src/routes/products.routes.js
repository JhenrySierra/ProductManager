const express = require("express");
const controller = require('../controllers/product.controllers.js');

const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .post('/', controller.create)
    .put('/:id', controller.update)
    .delete('/:id', controller.remove)

module.exports = router;
