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
    },
    isAdmin:{
        type: Boolean,
        required: true
    }
}, {timestamps: true});

// Create methods
userSchema.methods.createAuthToken = function(){
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, 'jwtPrivateKey');
}

// Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;