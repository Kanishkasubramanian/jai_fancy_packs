import express from 'express';
const router = express.Router();
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/razorpay').post(protect, createRazorpayOrder);
router.route('/razorpay/verify').post(protect, verifyRazorpayPayment);

export default router;
