import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products with Search + Filter
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' } // case insensitive
  }
  if (category) {
    query.category = category
  }

  const products = await Product.find(query);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
});

// @desc    Create a product - Admin only. Creates sample then you edit
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample Name',
    price: req.body.price || 0,
    category: req.body.category || 'Sample Category',
    description: req.body.description || 'Sample description',
    countInStock: req.body.countInStock || 0,
    brand: req.body.brand || 'Sample Brand',
    image: req.file ? `/uploads/${req.file.filename}` : '/images/sample.jpg', // handles file upload
    user: req.user._id, // who created it
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.image = req.file ? `/uploads/${req.file.filename}` : product.image; // ADD THIS for upload
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };