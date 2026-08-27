const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        });

        for (let item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty }
            });
        }

        const io = req.app.get('io');
        io.emit('orderPlaced', {
            orderId: order._id,
            status: order.orderStatus,
            totalPrice: order.totalPrice
        });

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = orderStatus;

            if (orderStatus === 'Delivered') {
                order.isDelivered = true;
            }

            const updatedOrder = await order.save();

            const io = req.app.get('io');
            io.emit('orderStatusUpdated', {
                orderId: order._id,
                status: orderStatus
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (order.orderStatus !== 'Order Placed') {
            return res.status(400).json({
                message: 'Order cannot be cancelled at this stage'
            });
        }

        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();

        for (let item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.qty }
            });
        }

        const io = req.app.get('io');
        io.emit('orderStatusUpdated', {
            orderId: order._id,
            status: 'Cancelled'
        });

        res.json(updatedOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;