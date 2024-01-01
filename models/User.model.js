import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";


const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[100,"name cannot be more than 100 characters"],
        minLength:[4,"name cannot be smaller than 4 characters"],
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"],
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password should be greater than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},
    {
        timestamps:true,    
    }
);

schema.pre("save",async function(next){
    if(!this.isModified){
        next();
    }
    // const gensalt = await bcrypt.gensalt(10);
    this.password = await bcrypt.hash(this.password,10);
})

// jwt token 

schema.methods.getJWTToken = function(){
    return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiredIn:process.env.JWT_EXPIRE,
    })
}

schema.methods.comparePassword = async function(password){
    const decode = await bcrypt.compare(this.password,password);
    return decode;
}

schema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex"); // output 16 Bytes of random data
    this.getResetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now()+15*60*1000;
    return resetToken;
}

const User = mongoose.model("User",schema);
export default User;