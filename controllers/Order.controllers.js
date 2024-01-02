import Order from "../models/Order.model.js";
import Product from "../models/Product.js";
import asyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorhandler.js";

// import {newOrder,getSingleOrder,myOrders,getAllOrders,updateOrder,deleteOrder} from "../controllers/Order.controllers.js";

// create new order

const newOrder = asyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(201).json({
        success:true,
        order,
    })
})

// get single order

const getSingleOrder = asyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order){
        return next(new ErrorHandler("order not found with this id",404));
    }
    res.status(200).json({
        success:true,
        order,
    })
})

// get logged in user Order

const myOrders = asyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    res.status(200).json({
        success:true,
        orders,
    })
})


// get all orders 

const getAllOrdes = asyncError(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})


// update order status 

const updateOrder = asyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }
    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(o)=>{
            await updateStock(o.product,o.quantity);
        })
    }
    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
})

// update stock 

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -=quantity;
    await product.save({validateBeforeSave:false});
}


// delete Order 

const deleteOrder = asyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    await Order.remove();
    res.status(200).json({
        success:true,
    })
})


export {deleteOrder,updateOrder,getAllOrdes,myOrders,getSingleOrder,newOrder};