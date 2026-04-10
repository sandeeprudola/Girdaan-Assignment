const mongoose=require("mongoose")
const Student = require("./Student")

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:"true"
    },
    status:{
        type:String,
        enum:["pending","done"],
        default:"pending"
    }
},{timestamps:true})

module.exports=mongoose.model("Task",taskSchema)