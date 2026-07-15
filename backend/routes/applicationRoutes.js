const express = require("express");
const Application = require("../models/Application");
const Career = require("../models/Career");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply to a career (logged-in user)
// body: { careerId }
router.post("/", protect, async (req, res) => {
    try {
        const { careerId } = req.body;
        if (!careerId) {
            return res.status(400).json({ message: "careerId is required." });
        }

        const career = await Career.findById(careerId);
        if (!career) {
            return res.status(404).json({ message: "Career not found." });
        }

        const existing = await Application.findOne({ user: req.user.id, career: careerId });
        if (existing) {
            return res.status(409).json({ message: "You've already applied to this career." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const application = await Application.create({
            user: user._id,
            fullName: user.fullName,
            email: user.email,
            career: careerId,
            careerName: career.name,
        });

        logActivity(user, "Applied to career", career.name);

        return res.status(201).json({ message: "Application submitted.", application });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "You've already applied to this career." });
        }
        return res.status(500).json({ message: "Server error submitting application." });
    }
});

// @route   GET /api/applications/me
// @desc    Get the logged-in user's own applications
router.get("/me", protect, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id })
            .populate("career", "name averageSalary preferredCity")
            .sort({ appliedAt: -1 });
        return res.json(applications);
    } catch (err) {
        return res.status(500).json({ message: "Server error fetching applications." });
    }
});

// @route   GET /api/applications   (admin only — everyone's applications)
// Query params: search=, page=1, limit=20
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const { search = "", page = 1, limit = 20 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { fullName: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
                { careerName: new RegExp(search, "i") },
            ];
        }

        const applications = await Application.find(query)
            .sort({ appliedAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Application.countDocuments(query);

        return res.json({
            applications,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching applications." });
    }
});

module.exports = router;
