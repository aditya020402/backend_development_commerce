// this is the error handling middleware 

import ErrorHandler from "../utils/errorhandler.js";

const errorHandlerMiddleware = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // wrong mongodb Id error 
    if(err.name === "CaseError"){
        const message = `Resource Not Found. Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === 'TokenExpiredError'){
        const message = `Json Web Token expired error, Try again later`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}

export default errorHandlerMiddleware;
