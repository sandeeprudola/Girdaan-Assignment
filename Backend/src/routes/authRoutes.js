const express=require("express")
const {registerAdmin, adminLogin}=require("../controllers/authController")



const router=express.Router();


router.post("/register",registerAdmin)
router.post("/login",adminLogin)


module.exports=router;