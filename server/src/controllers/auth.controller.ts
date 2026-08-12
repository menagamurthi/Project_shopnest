import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
}

// @desc    Register user
// @route   POST /api/users/register
export const register = async (req: any, res: any) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id.toString())
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}

// @desc    Login user
// @route   POST /api/users/login
export const login = async (req: any, res: any) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // not role
      token: generateToken(user._id.toString())
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
}