// Node Modules
const mongoose = require('mongoose');

// Create Schema 
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean
});

// Create Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;