import asyncError from "../middleware/catchAsyncError.js";
const stripe = process.env.STRIPE_SECRET_KEY;

const processPayment = asyncError(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"Testing",
        }
    })
    req.status(200).json({
        success:true,
        client_secret:myPayment.client_secret,
    })
})

const sendStripeApiKey = asyncError(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY,
    })
})