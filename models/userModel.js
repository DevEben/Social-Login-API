const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    }, 
    lastName: {
        type: String,
    },
    email: {
        type: String,
    }, 
    profilePicture: {
        type: String,
    }, 
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;