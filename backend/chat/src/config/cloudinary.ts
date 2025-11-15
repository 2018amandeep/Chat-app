import { v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({ 
  cloud_name: 'dkvyazspa', 
  api_key: '857755982314275', 
  api_secret: 'dO6_DOoh4kacWoHh9QeI-NhFSDo'
});

export default cloudinary;