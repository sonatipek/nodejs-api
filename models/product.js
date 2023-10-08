// Node Modules
const {mongoose, Schema} = require('mongoose');

// Create Schema 
const productSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean,
    categoryId: {type: Schema.Types.ObjectId, ref: "Category"} //reference type relation
});

// Create Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;