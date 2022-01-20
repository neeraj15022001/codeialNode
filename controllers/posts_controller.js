const Posts = require("../models/posts_schema")
module.exports.create = (req, res) => {
    console.log(req.body, req.user._doc._id)
    Posts.create({content: req.body.content, user: req.user._doc._id}, function(err,data) {
        if(err) {
            console.log("Error creating post", err);
            return;
        }
        console.log("Create post successfully", data)
        return res.redirect('back')
    })
}