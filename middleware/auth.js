// authentication middleware 

import ErrorHandler from "../utils/errorhandler.js";
import asyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";


const isAuthenticatedUser = asyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})

// we can either set a authorization header or we can set the jwt token inside the cookie
//here we have used next to pass the error to the central middleware function that we are having 
// alternative could be to throw the error but then we need to use try and catch block 
// const isAuthenticatedUser1 = asyncError(async(req,res,next)=>{
//     const {token} = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
//     console.log(token);
//     if(!token){
//         next(new ErrorHandler("Unauthorized to access this resource",401));
//     }
//     const decodeToken =  jwt.verify(token,process.env.JWT_SECRET);
//     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//     if(!user){
//         next(new ErrorHandler("Invalid access token",401));
//     }
//     req.user = user;
//     next();
// })



const authorizeRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role :${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
}

export {isAuthenticatedUser,authorizeRole};

