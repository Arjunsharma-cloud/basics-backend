import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import dotenv from "dotenv";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadoncloudinary = async (localfilepath) => {
    try {
        //uploading the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        });
        console.log("file has been uplaoded succesfully", response.url);
        return response;
    } catch (error) {
        console.log(error)
        fs.unlink(localfilepath, (err) => {
            console.log(localfilepath)
            if (err) {
                console.error("❌ Error deleting local file:", err);
            } else {
                console.log("🗑️ Temp file deleted:", localfilepath);
            }
        })
        return null;
    }
};

export { uploadoncloudinary };
