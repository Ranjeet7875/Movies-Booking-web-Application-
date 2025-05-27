const express=require("express")
const bcrypt=require("bcrypt")
const user = require("../model/user.model")
const jwt=require("jsonwebtoken")
const authMiddleware=require("../middlewares/authMiddle")
const router=express.Router()
router.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body
    const hashpass=await bcrypt.hash(password,10)
    const newuser=new user({name,email,password:hashpass})
    newuser.save()
    res.status(201).send({message:"New user signup",newuser})
})
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const userExits=await user.findOne({email})
    const ismatach=await bcrypt.compare(password,userExits.password)
    if(ismatach){
            const token=jwt.sign({userId:userExits._id},'your-secret-key')
        return res.status(200).send({message:"logined user",token})
    }
})
router.get("/profile", authMiddleware, async (req, res) => {
    const users = await user.findById(req.userId).select("-password");
    res.status(200).send({ message: "Protected user profile", users });
});
module.exports=router