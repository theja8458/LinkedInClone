
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

console.log("🌍 ENV values in cloudConfig:", {
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_SECRET_KEY: process.env.CLOUD_SECRET_KEY
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      // Use the environment variables for cloud name, API key, and secret
      folder: 'proconnect_dev',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
      public_id: file.originalname.split('.')[0] // Optional: to keep file name
    };
  }
});

export { cloudinary, storage };
