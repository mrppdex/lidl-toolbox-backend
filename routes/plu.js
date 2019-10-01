const mongoose = require('mongoose');
const express = require('express');

const { Product, ValidateProduct } = require('../models/product');

router = express.Router();

router.delete('/:id', async (req, res) => {
    let product;
    try {
        product = await Product.findByIdAndDelete(req.params.id);
    } catch (err) {
        res.status(400).send(err)
    } finally {
        res.send(product);
    }
})

router.put('/:id', async (req, res) => {
    let product = req.body;
    try {
        product = await Product.findByIdAndUpdate(req.params.id, product, {new: true})
    } catch (err) {
        return res.status(400).send(err);
    }
    res.send(product);
})

router.get('/:size', async (req, res) => {
    let size = req.params.size;
    size = parseInt(size, 10); 
    let products = await Product.aggregate([{ $sample: { size:  size} }]);
    res.send(products);
})

router.get('/', async (req, res) => {
    let products = await Product.find({});
    res.send({ products });
})

router.post('/', async (req, res) => {
    let product = req.body;
    const { error } = ValidateProduct(product);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    await Product.findOneAndUpdate({ barcode: product.barcode }, product, {new: true}, async (err, nproduct) => {
        if (err) {
            return res.status(500).send(err);
        } else if (!nproduct) {
            product = new Product(product);
            try {
                await product.save();
            } catch (err) {
                return res.status(500).send(err);
            }
            return res.send({ product });
        } else {
            return res.send({ nproduct });
        }
    })

    // await Product.findOne({ barcode: product.barcode }, async (err, nproduct) => {
    //     try {
    //         const result = await Product.update({ barcode: product.barcode }, product);
    //         if (result.n >= 1) {
    //             return res.send(result);
    //         }
    //     } catch (err) {
    //         return res.status(500).send(err);
    //     }
    // });

    // product = new Product(product);
    // try {
    //     await product.save();
    // } catch (err) {
    //     console.log("3: " + err);
    //     return res.status(500).send(err);
    // }
    // res.send({ product });
})

module.exports = router;