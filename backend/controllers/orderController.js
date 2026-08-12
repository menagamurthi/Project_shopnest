import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js'; // <-- KEEP ONLY THIS ONE
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, totalPrice } = req.body

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
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc    Get logged in user orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create Razorpay Order
// @desc    Create Razorpay Order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const options = {
    amount: order.totalPrice * 100, // in paise
    currency: "INR",
    receipt: order._id.toString(),
  };

  const razorpayOrder = await razorpay.orders.create(options);
  
  // USE findByIdAndUpdate instead of order.save() to avoid validation
  await Order.findByIdAndUpdate(
    req.params.id,
    { razorpayOrderId: razorpayOrder.id },
    { new: true }
  );

  res.json(razorpayOrder);
});


// @desc    Verify Payment
// @desc    Verify Payment
// @desc    Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log("Verify called with:", razorpay_payment_id);

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // TEST PAYMENT BYPASS
  if (razorpay_payment_id && razorpay_payment_id.startsWith('pay_test_')) {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: razorpay_payment_id,
          status: 'success',
          update_time: new Date().toISOString(),
          email_address: req.user?.email || 'test@test.com',
        }
      },
      { new: true } // return updated order
    );
    
    console.log("Test payment success");
    return res.json(updatedOrder);
  } 
  
  // REAL RAZORPAY
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: razorpay_payment_id,
          status: 'success',
          update_time: new Date().toISOString(),
          email_address: req.user?.email || 'user@email.com',
        }
      },
      { new: true }
    );
    res.json(updatedOrder);
  } else {
    res.status(400);
    throw new Error('Payment verification failed');
  }
});

// @desc    Get all orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { status } = req.body;
  console.log("Updating order:", req.params.id, "to status:", status);
  
  const updateFields = { status };
  
  if(status === 'Delivered') {
    updateFields.isDelivered = true;
    updateFields.deliveredAt = Date.now();
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: false } // <-- KEY: skip full validation
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  createOrder,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderToDelivered,
  createRazorpayOrder,
  verifyPayment
}