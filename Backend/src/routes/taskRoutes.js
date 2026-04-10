const express=require("express")
const adminAuth=require("../middlewares/authMiddleware")
const {
  createTask,
  getTask,
  getMarked,
}=require("../controllers/taskController")

const router=express.Router();

router.post("/",adminAuth,createTask)
router.get("/",adminAuth,getTask)
router.put("/:id",adminAuth,getMarked)

module.exports=router;