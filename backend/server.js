const express=require("express")
const app=express()
require('dotenv').config();

const cors = require('cors')
const collectionDB = require("./db")
const route  = require("./routes/user.route")
const movie=require("./routes/movie.route")
app.use(express.json())
app.use(cors())


app.get("/",(req,res)=>{
    res.send("Moving Booking PlateForm")
})
collectionDB()
app.use("/users-book",route)
app.use("/movie",movie)
app.listen(process.env.PORT,()=>{
    console.log("Server started")
})
