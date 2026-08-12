import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js'; // 1. ADD THIS
import upload from '../middleware/upload.js'; // 2. use your middleware file only

import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// @route   GET /api/products  - Public
// @route   POST /api/products - Admin only
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);

// @route   GET /api/products/:id - Public
// @route   PUT /api/products/:id - Admin only
// @route   DELETE /api/products/:id - Admin only
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;