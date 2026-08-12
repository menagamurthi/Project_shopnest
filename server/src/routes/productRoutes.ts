import express from 'express'
import { getProducts, addProduct } from '../controllers/productController'
import { protect, admin } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getProducts).post(addProduct)

router.route('/').get(getProducts).post(protect, admin, addProduct) 
export default router


