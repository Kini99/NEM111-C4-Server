const express=require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");
const { BlacklistModel } = require("./models/blacklist.model");

require("dotenv").config();

const app=express();

// app.use(cors());
app.use(express.json());

app.use("/users",userRouter);
app.use("/posts",postRouter);

app.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try{
        const blacklist = new BlacklistModel({token});
        await blacklist.save();
        res.status(200).json({msg:"Logged out successfully!",blacklist})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Server is running and db is connected")
    }catch(err){
        console.log(err)
    }
})