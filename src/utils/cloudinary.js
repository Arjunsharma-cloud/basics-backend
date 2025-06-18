import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEYS,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadoncloudinary = async (localfilepath)=>{
    try {
        //uploading the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath , {
            resource_type:"auto"
        })
        console.log("file has been uplaoded succesfully" , response.url);
        return response;
    } catch (error) {
        fs.unlink( localfilepath);
        return null;
    }
}


export {uploadoncloudinary}