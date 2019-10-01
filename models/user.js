const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectid = require('joi-objectid')(Joi)

// async function hashPassword(password) {
//     const salt = await bcrypt.genSalt(5);
//     return await bcrypt.hash(password, salt);
// }

function validateUser(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean(),
        role: Joi.string().required(),
        store: Joi.string()
    }
    return Joi.validate(user, schema);
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    store: {
        type: String,
        required: true
    }
});

userSchema.methods.generateToken = async function() {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        store: this.store,
        role: this.role
    }, config.get('password'))
}

userSchema.methods.hashPassword = async function() {
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(this.password, salt);
}

const User = mongoose.model('User', userSchema);

module.exports = { User, validateUser };
