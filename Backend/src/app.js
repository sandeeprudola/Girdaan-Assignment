const express=require("express")
const cors=require("cors")
const authRoutes=require("./routes/authRoutes")
const studentRoutes=require("./routes/studentRoutes")
const taskRoutes=require("./routes/taskRoutes")


const app=express();

app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).json({
        msg:"API is live"
    })
})

app.use("/api/auth",authRoutes)
app.use("/api/students",studentRoutes)
app.use("/api/task",taskRoutes)
module.exports=app
