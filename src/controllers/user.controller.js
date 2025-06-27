import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/users.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

console.log(12)
const registeruser = asyncHandler(async (req , res)=>{
   /** THE STEPS FOR REGISTRATION
    * ->GET USER DETAIL FROM FRONTEND
    * ->validation -- notempty
    * ->check if eamil/username already existed
    * ->check if there is @ gmail.com in gmail
    * ->check for images and avatar
    * ->create user object - create entry in DB
    * ->remove password and refresh token from the res
    * ->check for user creation
    * ->return res
    */

   const {fullname , username , email , password} = req.body;
   console.log("email : " , email);
   console.log("body : " , req.body); // this is the object

   //chceking if any field is empty or not

   if(
    [fullname , username , email , password].some((field)=>{
        return field?.trim() === "";
    })
   ){
    throw new ApiError(400 , "all the fields are required");
   }

   // checking email format
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    throw new ApiError(401 , "email format is not valid");
   }

   // checking if the user already exist
   const existeduser =  User.findOne({
    $or : [{username} , {email}]
   })

   if(existeduser){
    throw new ApiError(402 , "email or username is already taken ")
   }

   // checking for the avatar and cover image 
   const avatarlocalPath = req.files?.avatar[0]?.path;
   const coverImagelocalPath = req.files?.avatar[0]?.path;

   if(!avatarlocalPath){
    throw new ApiError(403 , "avatar field is required");
   }

   if(!coverImagelocalPath){
    throw new ApiError(404 , "coverimage field is required")
   }

   //upload on cloudinary
   const avatar = await uploadoncloudinary(avatarlocalPath);
   const coverImage = await uploadoncloudinary(coverImagelocalPath);

   if(!avatar){
    throw new ApiError(405 , "avatar file is required")
   }

   //create user object and entry in db
   const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

   //check if user is  saved in the daatbase while registering and 
   // removing password and refreshToken

   const createUser = await User.findById(user._id).select(" -password -refreshToken");

   if(createUser){
    throw new ApiError(500 , "something went wrong during registering");
   }

   // sendinf the response
   return res.status(201).json(
    new ApiResponse(200 , createUser , "user registered successfully")
   )

})

 

export default registeruser;