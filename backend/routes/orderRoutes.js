import express from 'express';
import { 
  createOrder,
  getOrders,
  updateOrderToDelivered,
  getOrderById,
  getMyOrders, 
  createRazorpayOrder, 
  verifyPayment 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Admin: Get all orders
router.route('/').get(protect, admin, getOrders);

// User: Create order
router.route('/').post(protect, createOrder);

// Admin: Update order status
router.put('/:id', protect, admin, updateOrderToDelivered);

// User: Get my orders
router.route('/myorders').get(protect, getMyOrders);

// Get order by ID
router.route('/:id').get(protect, getOrderById);

// Razorpay
router.route('/:id/pay').post(protect, createRazorpayOrder);
router.route('/:id/verify').post(protect, verifyPayment);

export default router;