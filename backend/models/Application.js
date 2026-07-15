const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        career: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
        careerName: { type: String, required: true },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["applied", "reviewed", "shortlisted", "rejected"], default: "applied" },
    },
    { timestamps: true }
);

// Prevent the same user from applying to the same career twice
applicationSchema.index({ user: 1, career: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
