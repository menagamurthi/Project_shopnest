import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductCount // <-- ADD THIS LINE
} from '../controllers/productController.js'; 

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/count').get(protect, admin, getProductCount); // Dashboard ku
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;