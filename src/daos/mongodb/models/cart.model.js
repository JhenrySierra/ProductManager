const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartSchema = new mongoose.Schema({
    // Use the default _id field as ObjectId type
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', // Reference to the 'products' collection (assumes product model name is 'products')
                required: true,
            },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
});

cartSchema.plugin(mongoosePaginate);

const CartModel = mongoose.model('carts', cartSchema);

module.exports = CartModel;
