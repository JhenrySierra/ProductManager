const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'CartModel' },
    role: { type: String, default: "user" }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
