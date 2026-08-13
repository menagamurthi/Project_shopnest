import asyncHandler from 'express-async-handler';
import Product from "../models/productModel.js";

// @desc    Get all unique categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(['All', ...categories]);
});

// @desc    Fetch all products with Search + Filter
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category } = req.query;
  let query = {};
  console.log("Searching for:", { keyword, category })

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  }
  if (category && category !== 'All') {
    query.category = { $regex: `^${category}$`, $options: 'i' }
  }
  const products = await Product.find(query);
  res.json(products);
});

// @desc    Fetch single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
});

// @desc    Create a product - Admin only. KEEP ONLY THIS ONE
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
  const { name, price, description, image, brand, category, countInStock } = req.body // <-- MUST HAVE image

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image // <-- MUST HAVE THIS LINE
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