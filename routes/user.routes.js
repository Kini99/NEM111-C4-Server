const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body;
    try {
        const existingUser=await UserModel.findOne({email});
        if(existingUser){
            return res.status(200).json({msg:"User already exist, please login"});
        }
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.json({ error: err.message });
            } else {
                const user = new UserModel({ name, email, gender, password: hash, age, city, is_married })
                await user.save();
                res.status(200).json({ msg: "User has been registered", user: req.body })
            }
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: user._id, user: user.name }, process.env.secret,{expiresIn:"7d"});
                    res.status(200).json({ msg: "Logged in Successfully", token })
                } else {
                    res.status(500).json({ error: err.message })
                }
            })
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = {
    userRouter
}