const Comments = require("../models/comments_schema")
const Posts = require("../models/posts_schema")
// const {newComment} = require("../mailers/comments_mailer");
const queues = require("../config/bull")
const commentEmailWorker = require("../workers/comment_email_worker")
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
            comment = await comment.populate("user", "name email")
            // newComment(comment)
            try {
                const job = await queues.emailQueue.add('emails', comment);
                console.log("Job Created", job.id)
            } catch (e) {
                console.log("Error while adding to queue", e);
            }
            if(req.xhr) {
                return res.status(200).send({
                    data: {
                        comment: comment
                    },
                    username: req.user.name,
                    message: "You Just Commented"
                })
            }
            req.flash("success", "Hey, You Just Commented")
            return res.redirect("back");
        } else {
            req.flash("error", "Something is tempered, you cannot comment")
        }
    } catch (e) {
        console.log("Error", e);
        req.flash("error", e)
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
            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        comments_id: req.params.id
                    },
                    message: "Comment Deleted"
                })
            }
            req.flash("success", "Comment Removed Successfully")
            return res.redirect("back")
        } else {
            req.flash("error", "You are not allowed to perform this action");
            return res.redirect("back")
        }
    } catch (e) {
        console.log("Error", e);
        req.flash("error", e)
        return;
    }
}