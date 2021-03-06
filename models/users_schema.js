const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = "/uploads/users/avatars"
const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + Date.now())
    }
})

//Static Methods

usersSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
usersSchema.statics.avatarPath = AVATAR_PATH;
const Users = mongoose.model("Users", usersSchema);
module.exports = Users