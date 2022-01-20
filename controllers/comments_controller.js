const Comments = require("../models/comments_schema")
const Posts = require("../models/posts_schema")
module.exports.create = (req, res) => {
    Posts.findById(req.body.post, function (err, post) {
        if (post) {
            Comments.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                },
                function (err, data) {
                    if (err) {
                        console.log("Error while creating comment", err);
                        return;
                    }
                    console.log("Comment created successfully", data);
                    post.comments.push(data);
                    post.save();
                    return res.redirect("back");
                })
        }
    })

}