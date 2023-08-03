const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    thumbnail: { type: String },
    stock: { type: Number, required: true },
    id: { type: Number, required: true }

});

const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;
