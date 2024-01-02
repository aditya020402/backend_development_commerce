import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import orderRoute from "./routes/Order.route.js";
import paymentRoute from "./routes/Payment.route.js";
import productRoute from "./routes/Product.route.js";
import userRoute from "./routes/User.route.js";
import errorHandlerMiddleware from "./middleware/errors.js";



// app.use(express.static("")) not serving frontend right now
// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true,
// }))


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieParser());

app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);
app.use("/api/v1",paymentRoute);



app.use(errorHandlerMiddleware);


export default app;