import asyncHandler from 'express-async-handler';
import Product from "../models/productModel.js";

// @desc    Get all unique categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(['All', ...categories]);
});

// @desc    Fetch all products with Search + Filter
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}
  const category = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {}

  const products = await Product.find({ ...keyword, ...category })

  // FIX: Old /uploads/ images ku full URL add pannu
  const updatedProducts = products.map(product => {
    if (product.image && !product.image.startsWith('http')) {
      product.image = `https://shopnest-backend-urkd.onrender.com${product.image}`
    }
    return product
  })

  res.json(updatedProducts)
})

// @desc    Fetch single product
// @route   GET /products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product - Admin only
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample Name',
    price: req.body.price || 0,
    category: req.body.category || 'Sample Category',
    description: req.body.description || 'Sample description',
    countInStock: req.body.countInStock || 0,
    brand: req.body.brand || 'Sample Brand',
    image: req.file ? `/uploads/${req.file.filename}` : '/images/sample.jpg',
    user: req.user._id,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body // image will be cloudinary url now

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image // <-- Cloudinary URL will come here from frontend
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };