import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from "../models/orderModel.js"; // ✅ correct
import { 
  createOrder, getOrders, updateOrderToDelivered, getOrderById, 
  getMyOrders, createRazorpayOrder, verifyPayment 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Create order
router.route('/').post(protect, createOrder).get(protect, admin, getOrders);

// My orders
router.route('/myorders').get(protect, getMyOrders);

// Get order by ID
router.route('/:id').get(protect, getOrderById);

// CANCEL ORDER - Add this
router.delete('/:id', protect, asyncHandler(async (req,res)=>{
  const order = await Order.findById(req.params.id);
  if(!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // user can cancel own order, admin can cancel any
  if(order.user.toString() !== req.user._id.toString() && !req.user.isAdmin){
    res.status(401);
    throw new Error("Not authorized")
  }
  if(order.isPaid || order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped'){
    res.status(400);
    throw new Error("Cannot cancel paid/shipped/delivered order")
  }
  await order.deleteOne();
  res.json({message: "Order cancelled successfully"})
}));

// Razorpay
router.route('/:id/pay').post(protect, createRazorpayOrder);
router.route('/:id/verify').post(protect, verifyPayment);

// Admin mark delivered
router.put('/:id', protect, admin, updateOrderToDelivered);

export default router;