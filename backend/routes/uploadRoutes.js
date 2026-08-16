import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { protect, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory la store
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file' });
  }

  try {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "shopnest" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ image: result.secure_url }); // https://res.cloudinary.com/...jpg

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
  console.log('Cloud:', process.env.CLOUDINARY_CLOUD_NAME)
});

export default router;