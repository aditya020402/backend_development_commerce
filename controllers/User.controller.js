// setting up the user controller 

import ErrorHandler from "../utils/errorhandler.js";
import asyncError from "../middleware/catchAsyncError.js";
import User from "../models/User.model.js";
import jwtToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js";


// import {registerUser,loginUser,logoutUser,forgotPassword,resetPassword,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser} from "../controllers/User.controller.js";

//register the user

const registerUser = asyncError(async(req,res,next)=>{

    const {name,email,password} = req.body;
    // const existedUser = await User.findOne({
    //     $or: [{ name }, { email }]
    // })
    const existedUser = await User.findOne({
        email:email,
    })
    if (existedUser) {
       next(new ErrorHandler("User with email or username already exists",409));
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        next(new ErrorHandler("Avatar file is required",400));
    }
    const myCloud = await uploadOnCloudinary(avatarLocalPath,'avatar');

    const user = await User.create({
        name,email,password,avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    })
    sendToken(user,201,res);
});

//login the user

const loginUser = asyncError(async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler("Please enter your email or password",400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

// logout the user

const logoutUser = asyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expiresIn:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"User Logged Out",
    })
})


// forgot password 

const forgotPassword = asyncError(async(res,res,next)=>{
    const user = await User.findOne({
        email:req.body.email,
    })
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not request this email then, please ignore it.`;
    try{
        await sendEmail({
            email:user.email,
            subject:`Password Recovery for the website`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
    }
    catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(err.message,500));
    }
})

// resetPassword 

const resetPassword = asyncError(async(req,res,next)=>{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$get:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired"));
    }
    if(req.body.password !== req.body.comfirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    sendToken(user,200,res);

})


// get user details 
const getUserDetails = asyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})


// update User Password 

const updatePassword = asyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})

// update user profile 

const updateProfile = asyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await deleteOnCloudinary(imageId);
        const myCloud = await uploadOnCloudinary(req.body.avatar,'avatar');
        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    
    res.status(200).json({
        success:true,
    })

})

// get all users 

const getAllUser = asyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users,
    })
})

// get single user 

const getSingleUser = asyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }
    res.status(200).json({
        success:true,
        user,
    })
})

// update user role 

const updateUserRole = asyncError(async(req,res,next)=>{
    const newUserData = {
        // name:req.body.name,
        // email:req.body.email,
        role:req.body.role,
    };
    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
});

// delete user 

const deleteUser = asyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400));
    }
    const imageId = user.avatar.public_id;
    deleteOnCloudinary(imageId);
    await user.remove();
    res.status(200).json({
        success:true,
        message:"user deleted successfully",
    })
});


export {registerUser,loginUser,logoutUser,forgotPassword,resetPassword,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser} ;