const asyncError = (theFunc) => (req,res,next) => {
    Promise.resolve(theFunc(req,res,next)).catch((err)=>next(err));
};

export default asyncError;


// another way 

// const asyncHandler = (theFunc) => async(req,res,next) => {
//     try{
//         await theFunc(req,res,next);
//     }
//     catch(error){
//         console.log(error);
//         // we use next if are having some route ahead or some middleware ahead 
//         // that is handling the error else we can also just send some response here 
//         req.status(error.code || 500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }
