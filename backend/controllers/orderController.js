import asyncHandler from 'express-async-handler';
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc Get Dashboard Stats
const getOrderStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
  const totalOrders = orders.length
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0)
  res.json({ totalOrders, totalSales })
})

// @desc Create new order - COD + Online both
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false, // Always false initially - only becomes true after payment verification
      paidAt: null
    })

    // ===== REDUCE STOCK =====
    for (const item of orderItems) {
      const product = await Product.findById(item.product)
      if (product) {
        if(product.countInStock < item.qty) {
          res.status(400)
          throw new Error(`${product.name} only has ${product.countInStock} in stock`)
        }
        product.countInStock -= item.qty
        await product.save()
      }
    }
    // ========================

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc Get logged in user orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user._id.toString()!== req.user._id.toString() &&!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Create Razorpay Order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const options = {
    amount: order.totalPrice * 100,
    currency: "INR",
    receipt: order._id.toString(),
  };
  const razorpayOrder = await razorpay.orders.create(options);
  await Order.findByIdAndUpdate(req.params.id, { razorpayOrderId: razorpayOrder.id }, { new: true });
  res.json(razorpayOrder);
});

// @desc Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // For test payments, accept if payment ID starts with 'pay_test_'
  if (razorpay_payment_id && razorpay_payment_id.startsWith('pay_test_')) {
    console.log('Test payment detected, marking as paid');
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      isPaid: true, 
      paidAt: Date.now(),
      paymentResult: { 
        id: razorpay_payment_id, 
        status: 'success', 
        update_time: new Date().toISOString(), 
        email_address: req.user?.email || 'user@email.com' 
      }
    }, { new: true });
    console.log('Order updated after test payment:', updatedOrder);
    return res.json(updatedOrder);
  }
  
  // For real payments, verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
  
  console.log('Expected signature:', expectedSignature);
  console.log('Received signature:', razorpay_signature);

  if (expectedSignature === razorpay_signature) {
    console.log('Signature verified, marking as paid');
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      isPaid: true, 
      paidAt: Date.now(),
      paymentResult: { 
        id: razorpay_payment_id, 
        status: 'success', 
        update_time: new Date().toISOString(), 
        email_address: req.user?.email || 'user@email.com' 
      }
    }, { new: true });
    res.json(updatedOrder);
  } else {
    console.error('Signature mismatch!');
    res.status(400);
    throw new Error('Payment verification failed - Signature mismatch');
  }
});

// @desc Get all orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if(order.user.toString()!== req.user._id.toString() &&!req.user.isAdmin){
    res.status(401);
    throw new Error("Not authorized")
  }
  if(order.isPaid || order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped'){
    res.status(400);
    throw new Error("Cannot cancel paid/shipped/delivered order")
  }
  await order.deleteOne();
  res.json({message: "Order cancelled successfully"})
})

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updateFields = { orderStatus: status }; // <-- fixed to orderStatus

  if(status === 'Delivered') {
    updateFields.isDelivered = true;
    updateFields.deliveredAt = Date.now();
  }

  const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });
  if (order) res.json(order);
  else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {getOrderStats, createOrder, getOrders, updateOrderToDelivered, getOrderById, getMyOrders, createRazorpayOrder, verifyPayment, cancelOrder }