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

// FIX FOR ES MODULES __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS - Allow both local and Vercel
const allowedOrigins = [
  'http://localhost:5173', // for local testing
  'https://project-shopnest.vercel.app' // for vercel production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// STATIC UPLOADS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('API is running'));

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// TEMP: Make user admin
app.get('/api/makeadmin/:email', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { isAdmin: true },
    { new: true }
  );
  res.json(user);
});

// DB CONNECTION WITH AWAIT - ONLY ONE TIME
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    
  } catch (err) {
    console.log('MongoDB Connection Error: ', err.message);
    process.exit(1);
  }
}

startServer();