import multer from "multer";

import path from 'path';
// Assuming you have a User model

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Folder to store profile photos
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${fileExt}`); // Create unique file name
  },
});

// Set file filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed'), false);
  }
};
const pdffilter=(req,file,cb)=>{
    if (file.mimetype === 'application/pdf') {

        cb(null, true); // Accept the file
    
      } else {
    
        cb(new Error('Invalid file type. Only PDF files are allowed.'), false); // Reject the file
    
      }
    
    };


// Initialize multer
export const uploadphoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
  },
});

export const uploadpdf=multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max file size: 5 MB
      },


})
// Profile photo upload route
