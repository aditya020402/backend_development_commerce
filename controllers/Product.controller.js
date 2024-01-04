import Product from "../models/Product.model.js";
import ErrorHandler from "../utils/errorhandler.js";
import asyncError from '../middleware/catchAsyncError.js';
import {uploadOnCloudinary,deleteOnCloudinary} from "../utils/cloudinary.js";
import apiFeature from "../utils/apiFeature.js";

//create product 

const createProduct = asyncError(async(req,res,next)=>{
    let images  = []
    const imagesLinks = req.files;
    console.log(imagesLinks);
    console.log(imagesLinks.length);
    for(let i=0;i<imagesLinks.length;i++){
        const result = await uploadOnCloudinary(imagesLinks[i].path,"products");
        // console.log(result);
        images.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
    }
    // req.body.images = imagesLinks;
    req.body.user = req.user.id;
    req.body.images = images;
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    })
})

//get all products 
const getAllProducts = asyncError(async(req,res,next)=>{
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const allProducts = await Product.find();
    // console.log(allProducts);
    const apiFeature1 = new apiFeature(Product.find(),req.query);
    apiFeature1.search().filter();
    const products = await apiFeature1.query;
    console.log(products);
    // let filteredProductsCount = products.length;
    // apiFeature1.pagination(resultPerPage);
    // products =  await apiFeature1.query;
    console.log(products);
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        // filteredProductsCount,
    })
    // res.send("true");
})


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
    // let images = [];
    // if(typeof req.body.images === "string"){
    //     images.push_back(req.body.images);
    // }
    // else{
    //     images = req.body.images;
    // }
    if(req.files.length!==0){
        for(let i=0;i<product.images.length;i++){
            await deleteOnCloudinary(product.images[i].public_id);
        }
        let images=[];
        const imagesLinks = req.files;
        for(let i=0;i<imagesLinks.length;i++){
            const result = await uploadOnCloudinary(imagesLinks[i].path,"products");
            images.push({
                public_id:result.public_id,
                url:result.secure_url,
            })
        }
        req.body.images = images;
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
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    for(let i=0;i<product.images.length;i++){
        await deleteOnCloudinary(product.images[i].public_id);
    }
    await Product.deleteOne({_id:req.params.id});
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
    // console.log(product);
    // console.log(req.user._id.toString(),'abcefgh');
    const isReviewed = product.reviews.find((rev)=>
        rev.user.toString() === req.user._id.toString()
    );
    // console.log(isReviewed);
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
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    })
    product.ratings = avg/product.reviews.length;
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
    // console.log(req.query.productId,req.query.id);
    console.log(product.reviews.length);
    const reviews = product.reviews.filter(
        (rev)=> rev._id.toString() !== req.query.id.toString()
    );
    // console.log(reviews);
    console.log(reviews.length);
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
    const prod = await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviews,
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    )
    console.log(prod);
    res.status(200).json({
        success:true,
    })
})

export {deleteReview,getProductReviews,createProduct,deleteProduct,createProductReview,updateProduct,getAdminProducts,getProductDetails,getAllProducts};