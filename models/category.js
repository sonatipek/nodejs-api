// Node Modules
const {mongoose, Schema} = require('mongoose');

// Create Schema 
const categorySchema = new Schema({
    name: String,
    isActive: Boolean,
    products:[{type: Schema.Types.ObjectId, ref: "Product"}]
});

// Create Model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;