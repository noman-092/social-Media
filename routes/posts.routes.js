
const express = require("express");
const router = express.Router();
const PostCollection = require("../models/posts.schema");
const imagekit = require("../utils/imagekit");
const { middle } = require("../middleware/middle");


router.get("/create", middle, function (req, res, next) {
    res.render("createPost", {
        title: "Create Post | SocialMedia",
        user: req.user,
    });
});


router.post("/create", middle, async function (req, res, next) {
    try {
        const newPost = new PostCollection(req.body);

        const { fileId, url, thumbnailUrl } = await imagekit.upload({
            file: req.files.media.data,
            fileName: req.files.media.name,
            folder:'/Media/post'
        });

        newPost.media = { fileId, url, thumbnailUrl };
        newPost.user = req.user._id;

        req.user.posts.push(newPost._id);

        await newPost.save();
        await req.user.save();

        res.redirect("/users/profile");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});
module.exports = router;