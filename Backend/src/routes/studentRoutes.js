const express=require("express")
const adminAuth=require("../middlewares/authMiddleware")
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
}=require("../controllers/studentController")

const router=express.Router()

router.post("/",adminAuth,createStudent)
router.get("/",adminAuth,getStudents)
router.put("/:id",adminAuth,updateStudent)
router.delete("/:id",adminAuth,deleteStudent)

module.exports=router;