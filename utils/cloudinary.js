import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import ErrorHandler from "../utils/errorhandler.js";


const uploadOnCloudinary = async(localFilePath,folder) => {
    try{
        if(!localFilePath) return null;
        // console.log(localFilePath,folder);
        const response = await cloudinary.uploader.upload(localFilePath,{
            folder:folder,
            width:150,
            crop:"scale",
            // resource_type:"auto",
        })
        // console.log(response);
        // console.log("file uploaded on cloudinary");
        // file has been uploaded on cloudinary
        // now deleted the file that was uploaded on the local server
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(err){
        fs.unlink(localFilePath); // removing the locally saved file on the server
        return null;
    }
}

const deleteOnCloudinary = async(public_url) => {
    try{
        await cloudinary.uploader.destroy(public_url);
        return 1;
    }
    catch(error){
        console.log("cloudinary error:",error);
        return -1;
    }
}

export {uploadOnCloudinary,deleteOnCloudinary};