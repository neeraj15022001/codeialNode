const Posts = require("../models/posts_schema")
const User = require("../models/users_schema")
module.exports.home = async (req, res) => {
    try {
        let data = await Posts.find({})
            .sort('-createdAt')
            .populate("user")
            .populate({path: "comments", populate: {path: "user"}})
            .sort("-createdAt")
        let users = await User.find({});
        return res.render("home", {
            title: "Home",
            posts: data,
            all_users: users
        })
    } catch (e) {
        console.log("Error", e);
        return;
    }
}
