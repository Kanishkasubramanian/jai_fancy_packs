import express from 'express';
const router = express.Router();
import {
    authUser,
    authAdmin,
    registerUser,
    getUserProfile,
    getUsers, // Added getUsers
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Added admin

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/admin-login', authAdmin);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers); // Added get users route

export default router;
