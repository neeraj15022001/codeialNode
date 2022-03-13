const Like = require("../models/like_schema");
const Posts = require("../models/posts_schema");
const Comments = require("../models/comments_schema");

module.exports.toggleLike = async (req, res) => {
    try {
        let likeable;
        let deleted = false;
        if(req.query.type.toLowerCase() === "post") {
            likeable = await Posts.findById(req.query.id).populate("likes");
        } else {
            likeable = await Comments.findById(req.query.id).populate("likes");
        }

    //    Check if like already exist
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user: req.user._id
        });

       if(existingLike) {
           likeable.likes.pull(existingLike);
           likeable.save();
           existingLike.remove();
           deleted = true;
       } else {
           let newLike = await Like.create({
               user: req.user._id,
               likeable : req.query.id,
               onModel : req.query.type
           })
           likeable.likes.push(newLike);
           likeable.save();
       }

       return res.json(200, {
           message: "Request Successfull",
           data: {
               deleted: deleted
           }
       })
    } catch (e) {

    }
}