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

module.exports.destroy = (req, res) => {
    Comments.findById(req.params.id, (err, comment) => {
        if (err) {
            console.log("Error while finding comment", err);
            return;
        }
        if (comment.user == req.user.id) {
            console.log("Verified")
            let postId = comment.post;
            comment.remove();
            Posts.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, (err, post) => {
                if (err) {
                    console.log("Error while deleting comment from posts comments array", err);
                    return;
                }
                return res.redirect("back")
            });
        } else {
            return res.redirect("back");
        }
    })
}