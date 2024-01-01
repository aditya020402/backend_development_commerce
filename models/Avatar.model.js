import mongoose from "mongoose";

const schema = new mongoose.Schema({
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    }
});


export default schema;