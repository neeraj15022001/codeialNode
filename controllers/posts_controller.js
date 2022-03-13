const Posts = require("../models/posts_schema")
const Comments = require("../models/comments_schema")
const Like = require("../models/like_schema")
module.exports.create = async (req, res) => {
    try {
        let post = await Posts.create({content: req.body.content, user: req.user._doc._id})
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post,
                    username: req.user.name
                },
                message: "Post Created!"
            })
        }
        req.flash("success", "Post Published")
        return res.redirect("back")
    } catch (e) {
        console.log("Error", e);
        req.flash("error", e)
        return res.redirect("back");
    }
}

module.exports.destroy = async (req, res) => {
    try {
        let post = await Posts.findById(req.params.id)
        if (post.user == req.user.id) {
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            post.remove();
            req.flash("success", "Post Removed")
            await Comments.deleteMany({post: req.params.id})
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                })
            }
            return res.redirect('back');
        } else {
            req.flash("error", "You Cannot Delete this Post")
            return res.redirect("back")
        }
    } catch (e) {
        console.log("Error", e);
        req.flash("error", e)
        return res.redirect("back");
    }
}