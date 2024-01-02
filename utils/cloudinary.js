import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file uploaded on cloudinary");
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

export default uploadOnCloudinary;