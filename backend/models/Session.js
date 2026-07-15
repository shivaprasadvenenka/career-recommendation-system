const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        loginTime: { type: Date, default: Date.now },
        logoutTime: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
