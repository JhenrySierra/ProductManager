const express = require("express");
const controller = require('../controllers/product.controllers.js');
const checkUserRole = require('../middlewares/checkUserRole.js'); // Adjust the path accordingly


const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .post('/', checkUserRole, controller.create)
    .put('/:id', controller.update)
    .delete('/:id', checkUserRole, controller.remove)

module.exports = router;
