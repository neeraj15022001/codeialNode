const Posts = require("../models/posts_schema")
const User = require("../models/users_schema")
module.exports.home = (req, res) => {
    Posts.find({})
        .populate("user")
        .populate({path: "comments", populate: {path: "user"}})
        .exec(function (err, data) {
            if (err) {
                console.log("Error while getting posts", err);
                return;
            }
            User.find({}, (err, users) => {
                return res.render("home", {
                    title: "Home",
                    posts: data,
                    all_users: users
                })
            })

        })
}
