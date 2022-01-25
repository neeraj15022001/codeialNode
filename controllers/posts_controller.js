const Posts = require("../models/posts_schema")
const Comments = require("../models/comments_schema")
module.exports.create = async (req, res) => {
    try {
        await Posts.create({content: req.body.content, user: req.user._doc._id})
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
            post.remove();
            req.flash("success", "Post Removed")
            await Comments.deleteMany({post: req.params.id})
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