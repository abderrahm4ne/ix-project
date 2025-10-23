import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import adminAuthentication from '../src/middlewares/auth.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const tempDir = './uploads/temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post(
  '/admin/upload-product-images',
  adminAuthentication,
  upload.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No images uploaded' });
      }

      const uploadedImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          width: 800,
          height: 600,
          crop: 'limit',
          quality: 'auto',
        });

        uploadedImages.push(result.secure_url);

        fs.unlinkSync(file.path);
      }

      res.json({
        success: true,
        images: uploadedImages,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ success: false, message: 'Error uploading images', error: error.message });
    }
  }
);

export default router;
