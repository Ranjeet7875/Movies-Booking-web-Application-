const mongoose=require("mongoose")
const DB="mongodb://localhost:27017/moviesbook"
const collectionDB=async()=>{
    try {
        await mongoose.connect(DB)
        console.log("DB Connected")
    } catch (error) {
        console.log("something error")
    }
}
module.exports=collectionDB