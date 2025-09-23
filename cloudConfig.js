import "dotenv/config"; 
import {v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";

console.log("ENV:", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);
// Configure cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET 
});

// Setup storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_DEV",       // Cloudinary folder where files will be stored
    allowed_formats: ["jpeg", "jpg", "png", "webp"], // Allowed file types
  },
});

console.log("Cloudinary config loaded:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  hasSecret: !!process.env.CLOUD_API_SECRET
});



export { cloudinary, storage };