const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD PRODUCT
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !image ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: 'Please fill all fields'
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock
        });

        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE PRODUCT
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (image !== undefined) product.image = image;
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = stock;

        const updatedProduct = await product.save();

        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// DELETE PRODUCT
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Product removed successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;