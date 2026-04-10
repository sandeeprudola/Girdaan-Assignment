const Student=require("../models/Student")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const createStudent=async(req,res)=>{
    try{
        const{name,className,age}=req.body
        if(!name ||!className){
            return res.status(400).json({
                msg:"all fields required"
            })
        }
        const student=await Student.create({
            name,
            className,
            age
        })

        res.status(201).json({
            msg:"student created successfully",
            student,
        })
    }
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

const getStudents=async(req,res)=>{
    try{
        const students=await Student.find().sort({createdAt:-1})
        res.status(200).json({
            msg:"student fetched successfully",
            students
        })
    }
    catch(err){
        res.status(500).json({
            msg:"server error"
        })
    }
}

const updateStudent=async(req,res)=>{
    try{
        const {id}=req.params;
        const{name,className,age}=req.body

        const student=await Student.findByIdAndUpdate(
            id,
            {name,className,age},
            {new:true,runValidators:true}
        )
        if(!student){
            return res.status(404).json({
                msg:"student not found"
            })
        }
        res.status(200).json({
            msg:"student updated successfuly",
            student
        })
    }
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

const deleteStudent=async(req,res)=>{
    try{
        const {id}=req.params

        const student=await Student.findByIdAndDelete(id)
        if(!student){
            return res.status(400).json({
                msg:"student not found"
            })
        }
        res.status(200).json({
            msg:"student deleted",
        })
    }
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
}

module.exports={
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
}