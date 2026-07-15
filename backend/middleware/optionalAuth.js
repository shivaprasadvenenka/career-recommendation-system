const jwt = require("jsonwebtoken");

// Like `protect`, but never blocks the request. If a valid token is
// present, req.user is set; otherwise the request just continues
// as anonymous (used for routes that stay public but benefit from
// knowing who's logged in, like activity logging).
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        } catch (err) {
            // invalid/expired token — just treat as anonymous
        }
    }
    next();
};

module.exports = { optionalAuth };