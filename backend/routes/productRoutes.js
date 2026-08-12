import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// GET single product by ID - THIS IS PROBABLY MISSING
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export default router;