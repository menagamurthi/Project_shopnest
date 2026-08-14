import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/userModel.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// CORS - Only once, before routes
app.use(cors({
  origin: 'https://project-shopnest.vercel.app', // un Vercel URL
  credentials: true
}));
app.use(express.json());

// FIX FOR ES MODULES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// STATIC UPLOADS - Render la work aagathu, but local ku ok
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('API is running'));

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); // Cloudinary route

// TEMP: Make user admin
app.get('/api/makeadmin/:email', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { isAdmin: true },
    { new: true }
  );
  res.json(user);
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopnest')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));