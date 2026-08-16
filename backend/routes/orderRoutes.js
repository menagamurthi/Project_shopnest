import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from "../models/orderModel.js";
import { 
  createOrder, getOrders, updateOrderToDelivered, getOrderById, 
  getMyOrders, createRazorpayOrder, verifyPayment, getOrderStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Create order + Get all orders - only 1 post route
router.route('/').post(protect, createOrder).get(protect, admin, getOrders); 

router.route('/stats').get(protect, admin, getOrderStats); // Dashboard ku

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

router.delete('/:id', protect, asyncHandler(async (req,res)=>{
  const order = await Order.findById(req.params.id);
  if(!order) {
    res.status(404);
    throw new Error("Order not found");
  }
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

router.route('/:id/pay').post(protect, createRazorpayOrder);
router.route('/:id/verify').post(protect, verifyPayment);
router.put('/:id', protect, admin, updateOrderToDelivered);

export default router;