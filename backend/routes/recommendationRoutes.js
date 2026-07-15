const express = require("express");
const Career = require("../models/Career");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Simple % match: (user skills that overlap with career's required skills) / (total required skills)
function calculateMatch(userSkills = [], careerSkills = []) {
    const normalizedUser = userSkills.map((s) => s.toLowerCase().trim());
    const normalizedCareer = careerSkills.map((s) => s.toLowerCase().trim());

    if (normalizedCareer.length === 0) return { percent: 0, missing: [] };

    const matched = normalizedCareer.filter((skill) => normalizedUser.includes(skill));
    const missing = careerSkills.filter(
        (skill) => !normalizedUser.includes(skill.toLowerCase().trim())
    );

    const percent = Math.round((matched.length / normalizedCareer.length) * 100);
    return { percent, missing };
}

// @route   GET /api/recommendations
// @desc    Personalized recommendations for the logged-in user, based on their skills
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        const careers = await Career.find();

        const recommendations = careers
            .map((career) => {
                const { percent, missing } = calculateMatch(user.skills, career.requiredSkills);
                return {
                    career,
                    matchPercent: percent,
                    missingSkills: missing,
                };
            })
            .filter((r) => r.matchPercent > 0)
            .sort((a, b) => b.matchPercent - a.matchPercent);

        return res.json(recommendations);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error generating recommendations." });
    }
});

module.exports = router;
