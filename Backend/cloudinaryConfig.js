import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config({ path: './path/to/.env' });
    // Configuration
    cloudinary.config({ 
        cloud_name: 'dzjqhyusq', 
        api_key:'122222223869433', 
        api_secret: '41Vr7GdBsmb4_G-GfRGiPxa-7xk'// Click 'View API Keys' above to copy your API secret
    });
    const uploadCloudinary = async (localPath) => {
        try {
          if (!localPath) return null;
      
          // Upload the image to Cloudinary
          const response = await cloudinary.uploader.upload(localPath, {
            resource_type: 'auto', // Automatically detects the file type (image, video, etc.)
          });
      
          console.log("File uploaded to Cloudinary:", response.url);
          return response;
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          if (fs.existsSync(localPath)) fs.unlinkSync(localPath); // Clean up local file if upload fails
          return null;
        }
      };
      
      export default { uploadCloudinary };

