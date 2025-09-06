import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyJWT = asyncHandler(async(err,req,res,next)=>
    {
    try {
        const authHeader = req.header("Authorization");
        const token =
  req.cookies?.accessToken ||
  (typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : undefined);
    
            if(!token){
                throw new ApiError(401,"Unauthorized request")
            }
            console.log("Token received:", token);
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
           const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
           if(!user){
            throw new ApiError(401,"Invalid Access Token")
           }
    
           req.user = user;
           next();
    } catch (error) {
        throw new ApiError(401,error?.message ||
            "Invalid access token"
        )
    }
})

export {verifyJWT}