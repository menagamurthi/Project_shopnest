import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs'

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

export const getUserCount = asyncHandler(async (req, res) => { 
  const count = await User.countDocuments({})
  res.json({ count })
})
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.deleteOne()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})