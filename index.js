import express from "express";
import connectDB  from "./database/connectDB.js";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
dotenv.config({
    "path":"config.env",
})
import app from "./app.js";
const port = process.env.PORT || 3000;

const start  = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`listening to server at port ${port}`);
        })
        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET,
        });
    }
    catch(error){
        console.log("some error occured: ", error);
        process.exit(1);
    }
};
start();


//used when we are not using try and catch to resolve the unhandled promise rejection 
// and catch the uncaught exceptions

// process.on("uncaughtException",(err)=>{
//     console.log(`Some unhandled exception : ${err}`);
//     console.log(`Shutting down the server due to unhandled exception`);
//     process.exit(1);
// })

// connectDB(process.env.MONGO_URI);
// const server = app.listen(port,()=>{
//     console.log(`listening to server at port ${port}`);
// })

// process.on("unhandleRejection",(err)=>{
//     console.log(`Some unhandled rejection : ${err}`);
//     console.log(`Shutting down the server due to promise rejection`);
//     server.close(()=>{
//         process.exit(1);
//     })
// })