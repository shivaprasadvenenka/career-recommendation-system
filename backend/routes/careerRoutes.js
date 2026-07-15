const express = require("express");
const Career = require("../models/Career");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");
const { optionalAuth } = require("../middleware/optionalAuth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

// @route   GET /api/careers
// @desc    Search & filter careers (skills, city, salary, role)
// Query params: skills=python,sql  city=Bangalore  salary=10  role=Data Scientist
router.get("/", optionalAuth,async (req, res) => {
    try {
        const { skills, city, salary, role } = req.query;
        const query = {};
        let skillList = [];

        if (skills) {
            skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
            if (skillList.length > 0) {
                query.requiredSkills = {
                    $in: skillList.map((s) => new RegExp(s, "i")),
                };
            }
        }

        if (city && city.toLowerCase() !== "all cities" && city.toLowerCase() !== "any") {
            query.$or = [{ preferredCity: new RegExp(city, "i") }, { preferredCity: "Any" }];
        }

        if (role && role.toLowerCase() !== "all roles") {
            query.name = new RegExp(role, "i");
        }

        if (salary && salary.toLowerCase() !== "any") {
            query.averageSalary = { $gte: Number(salary) };
        }

        let careers = await Career.find(query).sort({ createdAt: -1 });

        // When searching by skills, rank the best-matching careers first.
        if (skillList.length > 0) {
            const countMatches = (career) =>
                career.requiredSkills.filter((rs) =>
                    skillList.some((s) => rs.toLowerCase().includes(s.toLowerCase()))
                ).length;

            careers = careers
                .map((career) => ({ career, matchCount: countMatches(career) }))
                .sort((a, b) => {
                    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount; // most matches first
                    return b.career.averageSalary - a.career.averageSalary; // tie-breaker
                })
                .map(({ career, matchCount }) => ({
                    ...career.toObject(),
                    matchedSkillsCount: matchCount,
                }));
        }
        if (req.user) {
            const filterSummary = [
                skillList.length ? `skills: ${skillList.join(", ")}` : null,
                city ? `city: ${city}` : null,
                role ? `role: ${role}` : null,
                salary ? `min salary: ${salary} LPA` : null,
            ].filter(Boolean).join(" | ") || "no filters";
            logActivity(req.user.id, "Searched careers", filterSummary);
        }
        return res.json(careers);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching careers." });
    }
});

// @route   GET /api/careers/:id
router.get("/:id", optionalAuth,async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) return res.status(404).json({ message: "Career not found." });

        if (req.user) logActivity(req.user.id, "Viewed career details", career.name);

        return res.json(career);
    } catch (err) {
        return res.status(500).json({ message: "Server error fetching career." });
    }
});

// @route   POST /api/careers   (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const career = await Career.create(req.body);
        return res.status(201).json(career);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error creating career." });
    }
});

// @route   PUT /api/careers/:id   (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!career) return res.status(404).json({ message: "Career not found." });
        return res.json(career);
    } catch (err) {
        return res.status(500).json({ message: "Server error updating career." });
    }
});

// @route   DELETE /api/careers/:id   (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id);
        if (!career) return res.status(404).json({ message: "Career not found." });
        return res.json({ message: "Career deleted." });
    } catch (err) {
        return res.status(500).json({ message: "Server error deleting career." });
    }
});

// @route   POST /api/careers/:id/save   (logged-in user saves a career)
router.post("/:id/save", protect, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id);
        if (!user.savedCareers.includes(req.params.id)) {
            user.savedCareers.push(req.params.id);
            await user.save();
        }

        const career = await Career.findById(req.params.id);
        logActivity(req.user.id, "Saved career", career ? career.name : req.params.id);

        return res.json({ message: "Career saved." });
    } catch (err) {
        return res.status(500).json({ message: "Server error saving career." });
    }
});

module.exports = router;
