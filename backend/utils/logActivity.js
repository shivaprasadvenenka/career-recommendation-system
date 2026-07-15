const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

// Records one activity entry. `userOrId` can be a full Mongoose user
// document you already have in hand, or just a user id — either works.
// Never throws: logging failures shouldn't break the real request.
const logActivity = async (userOrId, action, details = "") => {
    try {
        let id, fullName, email;

        if (userOrId && userOrId.fullName) {
            id = userOrId._id;
            fullName = userOrId.fullName;
            email = userOrId.email;
        } else {
            id = userOrId;
            const user = await User.findById(id).select("fullName email");
            if (!user) return;
            fullName = user.fullName;
            email = user.email;
        }

        await ActivityLog.create({ user: id, fullName, email, action, details });
    } catch (err) {
        console.error("Failed to log activity:", err.message);
    }
};

module.exports = logActivity;