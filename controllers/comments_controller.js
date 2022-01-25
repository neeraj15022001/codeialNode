const Comments = require("../models/comments_schema")
const Posts = require("../models/posts_schema")
module.exports.create = async (req, res) => {
    try {
        let post = await Posts.findById(req.body.post)
        if (post) {
            let comment = await Comments.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            post.comments.push(comment);
            post.save();
            return res.redirect("back");
        }
    } catch (e) {
        console.log("Error", e);
        return;
    }
}

module.exports.destroy = async (req, res) => {
    try {
        let comment = await Comments.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.remove();
            Posts.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            return res.redirect("back")
        }
    } catch (e) {
        console.log("Error", e);
        return;
    }
}