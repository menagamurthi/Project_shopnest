import { Request, Response } from 'express'
import Product from '../models/productModel'

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc    Add a product
// @route   POST /api/products
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, category, countInStock } = req.body
  
    const product = new Product({
      name, description, price, image, category, countInStock
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' })
  }
}