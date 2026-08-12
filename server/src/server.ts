import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes' 
import productRoutes from './routes/productRoutes'




dotenv.config()
connectDB()
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes) 
app.use('/api/products', productRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('ShopNest API Running'));


mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected')
})

