import express from 'express';
import Product from "../models/productModel.js";
import { protect, admin } from '../middleware/authMiddleware.js';
import { createProduct, updateProduct, deleteProduct, getProducts, getProductById, getCategories } from '../controllers/productController.js';

const router = express.Router();

// CREATE + GET ALL
router.route('/').post(protect, admin, createProduct).get(getProducts);

// GET categories
router.get('/categories', getCategories);

// GET ONE + UPDATE + DELETE - ONLY ONCE
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;