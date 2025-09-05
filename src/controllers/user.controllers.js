import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req,res)=>{
        // for testing 
    // res.status(200).json({
    //     message:"ok"
    // })

         // Actual Steps to follow (logic Building)
    //get user details from frontend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    // return res

// step-1  gettig the details
    const {email,fullname,username,password} = req.body
        // console.log("email: ",email)
    
//step-2 validation

    // if(fullname===""){
    //     throw new ApiError(400,'"Fullname is required')
    // }

    // in this you have to write multiple if-else 
    //  so use modern way , like using the some() in the array 

    if(
        [fullname,email,password,username].some((field)=>
        field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required")
    }

// step-3 checking if the user alreay exist or not 
    
   const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }


// step-4  checking for the images and the avatar
    // console.log(req.files)
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length>0){
            coverImageLocalPath = req.files.coverImage[0].path
        }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

// step-5 uploading to cloudinary 
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
         throw new ApiError(400,"Avatar is required")
    }

// step-6 used object creates , entry in db
  const user = await User.create({
        fullname,
        avatar:avatar?.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

//  step-7 removing the password and refresh token
    const createdUser = await User.findById(user._id)
        .select(
            "-password -refreshToken"
        )

//step-8 checking for user creation
        if(!createdUser){
            throw new ApiError(500,'Something went wrong while registering the user')
        }

//step -9 return res
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
})



export default registerUser