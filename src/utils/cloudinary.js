import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //if localpath is vaialable then upload it to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploade succesfull
    // console.log("file is uploaded on cloudinary", response.url);
fs.unlinkSync(localFilePath) // remove the locally saved temoporary files as the upload operation success.

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temoporary files as the upload operation got failed.
  }
};

export { uploadOnCloudinary };
