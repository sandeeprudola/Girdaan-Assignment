const Task=require("../models/Task")
const Student=require("../models/Student")
const jwt=require("jsonwebtoken")


const createTask=async(req,res)=>{
    try{
        const {title,description,student,status}=req.body;
        if(!title ||!student){
            return res.status(400).json({
                msg:"title and student are required"
            })
        }

        const existingStudent=await Student.findById(student)
        if(!existingStudent){
            return res.status(401).json({
                msg:"student not found"
            })
        }

        const task=await Task.create({
            title,
            description,
            student
        })

        res.status(200).json({
            msg:"task created successfully",
            task
        })
    }
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

const getTask=async(req,res)=>{
    try{
        const tasks=await Task.find()
    .populate("student","name className age")
    .sort({createdAt:-1})

    res.status(200).json({
        msg:"task fetched success",
        tasks
    })
    }
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

const getMarked=async(req,res)=>{
    try{const {id}=req.params

    const task=await Task.findByIdAndUpdate(
        id,
        {status:"done"},
        {new:true,runValidators:true}
    ).populate("student","name className age")

    if(!task){
        return res.status(400).json({
            msg:"task not found"
        })
    }
    res.status(200).json({
        msg:"task marked",
        task
    })}
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

module.exports={
    createTask,
  getTask,
  getMarked,
}