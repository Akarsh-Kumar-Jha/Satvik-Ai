const cloudinary = require('../config/CloudinaryConnect');

exports.uploadFileToCloudinary = async (File, folder, height, quality) => {
  try {
    const options = {
      folder,
    };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto";
    return cloudinary.uploader.upload(File.tempFilePath, options);
  } catch (error) {
    console.error(error.message);
    return { success: false, message: "Error while uploading file to Cloudinary.", error: error.message };
  }
};
