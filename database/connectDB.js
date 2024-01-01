import mongoose from "mongoose";

// const connectDB = (url) => {
//     mongoose.connect(url,
//         {
//             useUnifiedTopology:true,
//             useNewUrlParser:true,
//         },
//         ).then((data) => console.log(`connected to mongodb at ${url} and host is ${data.connection.host}`)).catch((error)=>{
//             console.log(error);
//             process.exit(1);
//         });
// }

// alternative way 

const connectDB = async(url) => {
    try{
        const connect = await mongoose.connect(url);
        console.log(`connected to mongodb at db-host: ${connect.connection.host}`)
    }
    catch(error){
        console.log("mongodb connection error:", error);
        process.exit(1);
    }
}

export default connectDB;