var random = require('mongoose-simple-random');
const mongoose = require('mongoose');

const Joi = require('@hapi/joi');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        unique: true,
        required: true
    },
    plu: { 
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String
    }
});

productSchema.plugin(random);

const Product = mongoose.model('Product', productSchema);

function ValidateProduct(product) {
    const schema = {
        barcode: Joi.string().required(),
        plu: Joi.number(),
        name: Joi.string().required(),
        url: Joi.string()
    }
    return Joi.validate(product, schema)
}

module.exports = { Product, ValidateProduct }