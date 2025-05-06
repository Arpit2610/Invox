const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_hoFGXJhJuGWXNj',
    key_secret: 'QSsYuFELKYyYlVtH5IgG9rHm'
});

// Test the Razorpay connection
razorpay.orders.all()
    .then(() => console.log('Razorpay connection successful'))
    .catch(err => console.error('Razorpay connection error:', err));

router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount, items } = req.body;
        console.log('Received order request:', { amount, items });

        // Validate the request
        if (!amount) {
            return res.status(400).json({
                message: 'Amount is required'
            });
        }

        // Ensure amount is a valid number and convert to paise
        const amountInPaise = Math.round(parseFloat(amount));
        
        if (isNaN(amountInPaise) || amountInPaise < 100) {
            return res.status(400).json({ 
                message: 'Invalid amount (minimum 1 INR)',
                details: 'Amount must be at least 100 paise (1 INR)'
            });
        }

        const orderOptions = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: 'rcpt_' + Date.now(),
            payment_capture: 1,
            notes: {
                items: JSON.stringify(items.map(item => ({
                    name: item.name,
                    quantity: item.quantity
                })))
            }
        };

        console.log('Creating order with options:', orderOptions);

        // Create Razorpay order
        const order = await razorpay.orders.create(orderOptions);
        
        if (!order || !order.id) {
            throw new Error('Failed to create Razorpay order');
        }

        console.log('Order created successfully:', order);

        // Send response with both order and key
        res.json({
            success: true,
            order: order,
            key: 'rzp_test_hoFGXJhJuGWXNj'
        });

    } catch (error) {
        console.error('Order creation error:', {
            message: error.message,
            stack: error.stack,
            error: error
        });

        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            details: error.message || 'Internal server error'
        });
    }
});

router.post('/verify', auth, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                message: 'Missing required payment verification parameters'
            });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', 'QSsYuFELKYyYlVtH5IgG9rHm')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            res.json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            details: error.message
        });
    }
});

module.exports = router; 