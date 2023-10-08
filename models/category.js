// Node Modules
const mongoose = require('mongoose');

// Create Schema 
const categorySchema = new mongoose.Schema({
    name: String,
    isActive: Boolean
});

// Create Model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;