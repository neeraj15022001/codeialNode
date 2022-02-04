const Posts = require("../../../models/posts_schema")
const Comments = require("../../../models/comments_schema");
module.exports.index = async (req, res) => {
    let posts = await Posts.find({})
        .sort("-createdAt")
        .populate({path: "user", select: "-password"})
        .populate({path: "comments", populate: {path: "user", select: "-password"}})
        .sort("-createdAt")
    return res.json(200, {
        message: "List of Posts",
        posts: posts
    })
}
module.exports.destroy = async (req, res) => {
    try {
        let post = await Posts.findById(req.params.id)
        console.log("post.user", post.user, "req.user", req.user)
        if(post.user == req.user.id) {
            post.remove();
            await Comments.deleteMany({post: req.params.id})
            return res.json(200, {
                message: "Post and Associated Comments deleted"
            });
        } else {
            return res.json(401, {
                message: "You cannot delete this post!"
            })
        }

    } catch (e) {
        console.log("Error", e)
        return res.json(500, {
            message: "Internal Server Error"
        })
    }

}