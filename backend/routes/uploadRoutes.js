import express from 'express'
import { upload } from '../middleware/uploadMiddleware.js'
const router = express.Router()

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`) // returns /uploads/image-12345.jpg
})

export default router