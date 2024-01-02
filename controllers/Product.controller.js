import Product from "../models/Product.model.js";
import ErrorHandler from "../utils/errorhandler.js";
import asyncError from '../middleware/catchAsyncError.js';
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js";






// get product details 

const getAdminProducts = asyncError(async(req,res,next)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products,
    })
})

// get product details 

const getProductDetails = asyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not found" , 404));
    }
    res.status(200).json({
        success:true,
        product,
    })
})

// update product details 

const updateProduct = asyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404));
    }
    let images = [];
    if(typeof req.body.images === "string"){
        images.push_back(req.body.images);
    }
    else{
        images = req.body.images;
    }
    if(images !== undefined){
        for(let i=0;i<product.images.length;i++){
            await deleteOnCloudinary(product.images[i].public_id);
        }
        const imagesLinks = [];
        for(let i=0;i<images.length;i++){
            const result = uploadOnCloudinary(images[i],"products");
            imagesLinks.push({
                public_id:result.public_id,
                url:result.secure_url,
            })
        }
        req.body.images = imagesLinks;
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success:true,
        product,
    })

})

//delete product 

const deleteProduct = asyncError(async(req,res,next)=>{
    const product = await Product.findById(req.param.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    for(let i=0;i<product.images.length;i++){
        await deleteOnCloudinary(product.images[i].public_id);
    }
    product.remove();
    res.status(200).json({
        success:true,
        message:"product delete successfully",
    })
})


// create new review or update review 

const createProductReview = asyncError(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev)=>{
        rev.user.toString() === req.user._id.toString()
    });
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating;
                rev.comment=comment;
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.review.length;
    }
    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += avg.rating;
    })
    product.ratings = avg/product.review.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
})



// get all reviews of the product 

const getProductReviews = asyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product Not found",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });

})



// delete review 

const deleteReview = asyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    const reviews = product.reviews.filter(
        (rev)=>rev._id.toString()!==req.query.id.toString()
    );
    let avg = 0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;
    })
    let ratings = 0;
    if(reviews.length===0){
        ratings=0;
    }
    else{
        ratings = avg/reviews.length;
    }
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviews,
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    )
    res.status(200).json({
        success:true,
    })
})