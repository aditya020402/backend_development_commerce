import mongoose from "mongoose"

const shippingSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    pinCode:{
        type:Number,
        required:true,
    },
    phoneNo:{
        type:Number,
        required:true,
    },
});

const OrderItem = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
})

const schema = new mongoose.Schema({
    shippingInfo:{
        type:shippingSchema,
    },
    orderItems:{
        type:[OrderItem],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    paymentInfo:{
        id:{
            type:String,
            required:true,
        },
        status:{
            type:String,
            required:true,
        },
    },
    paidAt:{
        type:Date,
        required:true,
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0,
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0,
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0,
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing",
    },
    deliveredAt:{
        Date,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },

},
    {
        timestamps:true,
    }
);


const Order = mongoose.model("Order",schema);

export default Order;

