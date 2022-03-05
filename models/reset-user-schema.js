const mongoose = require("mongoose");
const resetUserSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
}, {
    timestamps: true
});
const ResetUser = mongoose.model("reset-users", resetUserSchema);
module.exports = ResetUser;