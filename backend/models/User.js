const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String },
        password: { type: String, required: true },

        highestEducation: { type: String },
        collegeName: { type: String },
        graduationYear: { type: Number },
        cgpa: { type: Number },

        skills: [{ type: String }],
        preferredRole: { type: String },
        preferredLocation: { type: String },

        resumeUrl: { type: String },
        photoUrl: { type: String },

        role: { type: String, enum: ["user", "admin"], default: "user" },
        status: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },

        savedCareers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Career" }],

        lastActive: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
