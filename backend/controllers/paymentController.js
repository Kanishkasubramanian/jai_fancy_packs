import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret',
        });

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: 'receipt_order_' + Math.random().toString(36).substring(7),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).json({ message: 'Some error occured with Razorpay' });

        res.json(order);
    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ message: error.error?.description || error.message || 'Error creating Razorpay order' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret');

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        res.json({
            msg: 'success',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ message: error.message || 'Payment verification failed server-side' });
    }
};

export { createRazorpayOrder, verifyRazorpayPayment };
