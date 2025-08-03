const cloudinary = require('cloudinary').v2
require('dotenv').config();
try{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("✅ Cloudinary connected successfully!");
}catch(error){
    console.error(error.message);
    console.log("Error In Cloudinary Connect!",error.message);
}


module.exports = cloudinary;