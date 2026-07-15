const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
const { protect } = require("../middleware/auth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

// Min 8 chars, at least one uppercase, one lowercase, one number, one special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_REQUIREMENT_MESSAGE =
    "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword,
            highestEducation,
            collegeName,
            graduationYear,
            cgpa,
            skills,
            preferredRole,
            preferredLocation,
            resumeUrl,
            photoUrl,
        } = req.body;

        // Basic required-field validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ message: PASSWORD_REQUIREMENT_MESSAGE });
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            highestEducation,
            collegeName,
            graduationYear,
            cgpa,
            skills: Array.isArray(skills)
                ? skills
                : (skills || "").split(",").map((s) => s.trim()).filter(Boolean),
            preferredRole,
            preferredLocation,
            resumeUrl,
            photoUrl,
        });

        logActivity(user, "Registered", `Signed up with email ${user.email}`);

        return res.status(201).json({
            message: "Registration successful. Please log in.",
            userId: user._id,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during registration." });
    }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.status === "blocked") {
            return res.status(403).json({ message: "Your account has been blocked. Contact support." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        user.lastActive = new Date();
        user.status = "active";
        await user.save();

        await Session.create({
            user: user._id,
            fullName: user.fullName,
            email: user.email,
            loginTime: new Date(),
        });
        logActivity(user, "Logged in", `IP: ${req.ip || "unknown"}`);

        const token = generateToken(user);

        return res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                skills: user.skills,
                preferredRole: user.preferredRole,
                preferredLocation: user.preferredLocation,
                photoUrl: user.photoUrl,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during login." });
    }
});

// @route   POST /api/auth/admin-login
router.post("/admin-login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ email: username.toLowerCase(), role: "admin" });
        if (!user) {
            return res.status(401).json({ message: "Invalid admin credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin credentials." });
        }

        const token = generateToken(user);

        return res.json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during admin login." });
    }
});

// @route   POST /api/auth/logout
// @desc    Records the logout time on the user's most recent open session
router.post("/logout", protect, async (req, res) => {
    try {
        const session = await Session.findOne({
            user: req.user.id,
            logoutTime: null,
        }).sort({ loginTime: -1 });

        if (session) {
            session.logoutTime = new Date();
            await session.save();
        }

        logActivity(req.user.id, "Logged out");

        return res.json({ message: "Logged out." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during logout." });
    }
});
// @route   POST /api/auth/reset-password
// @desc    Reset a user's password by confirming their registered email
// body: { email, newPassword, confirmNewPassword }
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword, confirmNewPassword } = req.body;

        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({ message: PASSWORD_REQUIREMENT_MESSAGE });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(200).json({
                message: "If that email is registered, the password has been updated. You can now log in.",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: "Password updated successfully. You can now log in.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error resetting password." });
    }
});

module.exports = router;
