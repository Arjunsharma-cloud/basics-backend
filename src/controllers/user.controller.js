import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/users.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async(userID)=>{
    try {
        const user = await User.findById(userID);
        const accesstoken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        
        user.refreshToken = refreshtoken;
        await user.save({validateBeforeSave : false});

        return {accesstoken , refreshtoken};

    } catch (error) {
        throw new ApiError(503 , "something went wrong during generating access and refresh tokens")
    }
}

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
   const existeduser = await User.findOne({
    $or : [{username} , {email}]
   })

   if(existeduser){
    throw new ApiError(402 , "email or username is already taken ")
   }

   // checking for the avatar and cover image 
   const avatarlocalPath = req.files?.avatar[0]?.path; 
   const coverImagelocalPath = req.files?.coverImage[0]?.path;
   console.log(avatarlocalPath);

   if(!avatarlocalPath){
    throw new ApiError(403 , "avatar field is required");
   }

   if(!coverImagelocalPath){
    throw new ApiError(404 , "coverimage field is required")
   }

   //upload on cloudinary
   // error in uploading
   const avatar = await uploadoncloudinary(avatarlocalPath);// here is the errror i think
   const coverImage = await uploadoncloudinary(coverImagelocalPath);// here also
   console.log( "Avatar : " , avatar);
   if(!avatar){
    throw new ApiError(405 , "avatar file is required but path is defined")
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

   console.log(user);
   //check if user is  saved in the daatbase while registering and 
   // removing password and refreshToken

   let createUser;

   try {
        createUser = await User.findById(user._id).select(" -password -refreshToken");
    
   } catch (error) {
    console.log(error);
   }

   if(!createUser){
    throw new ApiError(500 , "something went wrong during registering");
   }

   // sendinf the response
   return res.status(201).json(
    new ApiResponse(200 , createUser , "user registered successfully")
   )

})

const loginuser = asyncHandler(async(req , res)=>{
    // req body => take data
    // username or email based
    // find the user in the db
    // check password
    // access and refresh token
    // send cookie

    const {username , email , password} = req.body;

    if(!username && ! email){
        throw new ApiError(410 , "username and email is required");
    }

    const user = await User.findOne({
        $or : [{email} , {username}]
    })

    if(!user){
        throw new ApiError(411 , "user does not exist");
    }

    const ispasswordvalid = user.isPasswordCorrect(password);
    if(!ispasswordvalid){
        throw new ApiError(412 , "password is incorrect");
    }

    if(ispasswordvalid){
        console.log("password is correct")
    }

    const {accesstoken , refreshtoken} = await generateAccessandRefreshToken(user._id); // in destructring name shoukd be same of 
    // caruable then is returned by the function
    console.log("access and refrsh token is taken and its working" , accesstoken , refreshtoken)

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");
    
    console.log("logged in user is also created")

    if(loggedinUser){
        console.log("done taking logged in user")
    }

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(202)
    .cookie("accessToken" , accesstoken , options)
    .cookie("refreshToken" , refreshtoken , options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser , 
                accessToken: accesstoken ,
                RefreshTOken :  refreshtoken
                
            },
            "user logged in successfully"
        )
    )

})

// now for logout we dont have anyting like any req frommwhich we can take the email or usenrame
//to find teh right user so we will just create one more midlleware
// that middleware will take the access token and will add user details to req.user then we can find teh user 

const logoutuser = asyncHandler(async(req , res)=>{
    //clear the cookies 
    //remove the refershToken from the DB

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(203)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "user logged out"))
})

const refreshaccessToken = asyncHandler(async(req , res)=>{
    //take the refresh token form the req
    // compare the incominrefreshToken with the one saved in the database
    // if same generate more and give it to the user

    console.log(10000); 

    const incomingrefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingrefreshToken){
        throw new ApiError(418 , "no token in the request")
    }
    console.log(incomingrefreshToken);

    try {
        
        const decodedtoken = jwt.verify(incomingrefreshToken , process.env.REFRESH_TOKEN_SECRET)
        console.log(1);
        

        const user = await User.findById(decodedtoken?._id);
        if(!user){
            throw new ApiError(419 , "user is not found by the decodedtoken")
        }
        console.log(1);

        if(incomingrefreshToken !== user?.refreshToken){
            throw new ApiError(420 , "refresh token is expired")
        }

        const {accesstoken , Refreshtoken} = await generateAccessandRefreshToken(user._id);

        const options = {
            httpOnly : true,
            secure : true
        }

        return res
        .status(204)
        .cookie("accessToken" , accesstoken , options)
        .cookie("RefreshToken" , Refreshtoken , options)
        .json(
            new ApiResponse(
                200,
                {
                    Accesstoken: accesstoken , 
                    refreshtoken : Refreshtoken
                },
                "access and refresh token is refreshed"
            )
        )


    } catch (error) {
        throw new ApiError(419 , error?.message || " error in refreshaccessToken ");
    }

})
 

export {
    registeruser,
    loginuser,
    logoutuser,
    refreshaccessToken
};