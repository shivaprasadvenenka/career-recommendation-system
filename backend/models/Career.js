const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        requiredSkills: [{ type: String, required: true }],
        averageSalary: { type: Number, required: true }, // in LPA
        preferredCity: { type: String, default: "Any" },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Very Hard"], default: "Medium" },
        experience: { type: String, default: "0-1 years" },
        growth: { type: String, default: "High" },

        image: { type: String },
        companiesHiring: [{ type: String }],
        learningRoadmap: [{ type: String }],
        projects: [{ type: String }],
        certifications: [{ type: String }],
        courses: [{ type: String }],
        books: [{ type: String }],
        youtubeResources: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Career", careerSchema);
