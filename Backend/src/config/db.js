const mongoose=require("mongoose");


const connectDB=async()=>{
    try{
        const con=await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected successfully")
    }
    catch(error){
        console.error("Failed to start server:", error.message);
  process.exit(1);
    }
}

module.exports=connectDB