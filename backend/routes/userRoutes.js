import express from 'express';
import User from "../models/userModel.js"; // ✅ correct
import { protect, admin } from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUsers, getUserCount ,deleteUser } from '../controllers/userController.js';
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/').get(protect, admin, getUsers); // already
router.route('/count').get(protect, admin, getUserCount); // ADD THIS
router.route('/:id').delete(protect, admin, deleteUser); // ADD THIS
export default router;