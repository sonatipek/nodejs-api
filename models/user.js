// Node Modules
const {mongoose, Schema} = require('mongoose');
const jwt = require('jsonwebtoken');
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

// Create methods
userSchema.methods.createAuthToken = () => {
    return jwt.sign({_id: this._id}, 'jwtPrivateKey');
}

// Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;