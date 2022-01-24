const Posts = require("../models/posts_schema")
const Comments = require("../models/comments_schema")
module.exports.create = (req, res) => {
    console.log(req.body, req.user._doc._id)
    Posts.create({content: req.body.content, user: req.user._doc._id}, function (err, data) {
        if (err) {
            console.log("Error creating post", err);
            return;
        }
        console.log("Create post successfully", data)
        return res.redirect('back')
    })
}

module.exports.destroy = (req, res) => {
    Posts.findById(req.params.id, (err, post) => {
        if (err) {
            console.log("Error while retrieving post for deletion", err);
            return;
        }
        if (post.user == req.user.id) {
            post.remove();
            Comments.deleteMany({post: req.params.id}, (err) => {
                if (err) {
                    console.log("Error while deleting comments for deleted post", err);
                    return;
                }
                return
            })
            return res.redirect('back');
        } else {
            return res.redirect("back");
        }
    })
}