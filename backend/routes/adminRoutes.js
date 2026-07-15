const express = require("express");
const User = require("../models/User");
const Career = require("../models/Career");
const Session = require("../models/Session");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminAuth");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

router.use(protect, adminOnly);

// @route   GET /api/admin/stats
// @desc    Total members, active members, logins this week, logins this month
router.get("/stats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const activeUsers = await User.countDocuments({ role: "user", status: "active" });

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday this week
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const thisWeekLogins = await User.countDocuments({
            role: "user",
            lastActive: { $gte: startOfWeek },
        });

        const thisMonthLogins = await User.countDocuments({
            role: "user",
            lastActive: { $gte: startOfMonth },
        });

        return res.json({ totalUsers, activeUsers, thisWeekLogins, thisMonthLogins });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching stats." });
    }
});

// @route   GET /api/admin/users
// @desc    List members, filterable by search text and login recency
// Query params: search=, page=1, limit=10, period=all|week|month
router.get("/users", async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10, period = "all" } = req.query;
        const query = { role: "user" };

        if (search) {
            query.$or = [
                { fullName: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
            ];
        }

        const now = new Date();

        if (period === "week") {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            query.lastActive = { $gte: startOfWeek };
        } else if (period === "month") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query.lastActive = { $gte: startOfMonth };
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ lastActive: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        return res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching users." });
    }
});

// @route   PUT /api/admin/users/:id   (edit user)
router.put("/users/:id", async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.password;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select(
            "-password"
        );
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error updating user." });
    }
});

// @route   PUT /api/admin/users/:id/block
router.put("/users/:id/block", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.status = user.status === "blocked" ? "active" : "blocked";
        await user.save();
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error blocking user." });
    }
});

// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ message: "User deleted." });
    } catch (err) {
        return res.status(500).json({ message: "Server error deleting user." });
    }
});

// @route   GET /api/admin/sessions   (login/logout activity, admin only)
router.get("/sessions", async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const sessions = await Session.find()
            .sort({ loginTime: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Session.countDocuments();

        return res.json({
            sessions,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching sessions." });
    }
});
// @route   GET /api/admin/activity
// @desc    All logged user activity — searchable, filterable by action type
// Query params: search=, action=all|<action name>, page=1, limit=20
router.get("/activity", async (req, res) => {
    try {
        const { search = "", action = "all", page = 1, limit = 20 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { fullName: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
            ];
        }

        if (action && action.toLowerCase() !== "all") {
            query.action = action;
        }

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await ActivityLog.countDocuments(query);
        const actionTypes = await ActivityLog.distinct("action");

        return res.json({
            logs,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            actionTypes,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching activity log." });
    }
});

module.exports = router;
