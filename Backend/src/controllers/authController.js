const Admin=require("../models/Admin")
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")


const registerAdmin=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                msg:"all fields required"
            })
        }
        const existingadmin=await Admin.findOne({email})
        if(existingadmin){
            return res.status(400).json({
                msg:"admin already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const admin=await Admin.create({
            name,
            email,
            password:hashPassword,
        })
        res.status(200).json({
            msg:"admin created successfully",
        })
    }
    catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
        msg: err.message || "internal server error"
    });
}

}

const adminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                msg:"email/pass required"
            })
        }
        const admin=await Admin.findOne({email})
        if(!admin){
            return res.status(401).json({
                msg:"admin not found"
            })
        }
        const isvalid=await bcrypt.compare(password,admin.password)
        if(!isvalid){
            return res.status(401).json({
                msg:"invalid credentials"
            })
        }

        const token=jwt.sign(
            {id:admin._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )

        res.status(200).json({
            msg:"login success",
            token:token,
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg:"server error"
        })
    }
}

module.exports = {
    registerAdmin,
    adminLogin
  };