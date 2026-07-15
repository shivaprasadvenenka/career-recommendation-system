const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

// @route   GET /api/users/me
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error fetching profile." });
    }
});

// @route   PUT /api/users/me
router.put("/me", protect, async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.role; // never let a user self-promote to admin
        delete updates.status;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        } else {
            delete updates.password;
        }

        if (updates.skills && !Array.isArray(updates.skills)) {
            updates.skills = updates.skills.split(",").map((s) => s.trim()).filter(Boolean);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
        }).select("-password");

        logActivity(req.user.id, "Updated profile", `Fields changed: ${Object.keys(req.body).join(", ") || "none"}`);

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error updating profile." });
    }
});

module.exports = router;
