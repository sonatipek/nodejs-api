// Node Modules
const {mongoose, Schema} = require('mongoose');

// Create Schema 
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;