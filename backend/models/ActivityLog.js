const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        action: { type: String, required: true }, // e.g. "Logged in", "Searched careers"
        details: { type: String, default: "" },   // e.g. "skills: python, sql"
    },
    { timestamps: true } // createdAt = when the activity happened
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);