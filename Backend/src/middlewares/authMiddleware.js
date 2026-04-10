const jwt=require("jsonwebtoken")
const Admin = require("../models/Admin");


const adminAuth=async(req,res,next)=>{
    try{
        let token

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({
                msg:"not authorised"
            })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const admin=await Admin.findById(decoded.id).select("-password")
        
        if(!admin){
            return res.status(401).json({
                msg:"admin not found"
            })
        }

        req.admin=admin;
        next();
    }
    catch(err){
        res.status(500).json({
            msg:"not authorized,invalid token"
        })
    }
}

module.exports=adminAuth