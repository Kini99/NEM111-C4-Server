const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../models/post.model");

const postRouter = express.Router();

postRouter.use(auth);

postRouter.post("/add", async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.status(200).json({ msg: "New post added", post: req.body })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

postRouter.get("/", async (req, res) => {
    const maxPosts=3;
    const pageNo=Number(req.query.page)||1;
    try {
        const posts = await PostModel.find({ userId: req.body.userId })
        .limit(maxPosts)
        .skip((pageNo-1)*maxPosts);
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

postRouter.get("/top", async (req, res) => {
    const maxPosts=3;
    const pageNo=Number(req.query.page)||1;
    try {
        const posts=await PostModel.find({ userId: req.body.userId })
        .sort({no_of_comments:-1})
        .limit(maxPosts)
        .skip((pageNo-1)*maxPosts);
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

postRouter.patch("/update/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        await PostModel.findByIdAndUpdate({ _id: postId }, req.body);
        res.status(200).json({ msg: "Post has been updated", updates: req.body })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

postRouter.delete("/delete/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        await PostModel.findByIdAndDelete({ _id: postId });
        res.status(200).json({ msg: "Post has been deleted" })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


module.exports = {
    postRouter
}