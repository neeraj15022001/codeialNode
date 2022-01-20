const mongoose = require("mongoose")

const commnentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    }
}, {
    timestamps: true
});

const Comments = mongoose.model("Comments", commnentsSchema);

module.exports = Comments;