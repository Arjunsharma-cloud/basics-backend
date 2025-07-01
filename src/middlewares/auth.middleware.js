import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/users.model.js";

dotenv.config();

export const verifyJWT = asyncHandler(async (req , res , next)=>{
    try {
        // cookies are accessibe to all the route on the same domain ex. localhost:5001
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
        console.log("token is taken" , token)

        if(!token){
            throw new ApiError(415 , "unauthorized request");
        }

        //this is the error
        const decodedtoken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)// this gives the payload/data that is stored in accesstoken
        console.log("decode taken is taken")
       
        const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");
        console.log("user is taken form the decode token")
       
        if(!user){
            throw new ApiError(416 , "user is not created form decodedTOken");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(414 , error?.mssg || "invalid access token");
    }
})