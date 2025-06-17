const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Auth middleware
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// Role check middleware
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res
                .status(403)
                .json({ error: "Forbidden: Insufficient privileges" });
        }
        next();
    };
}

module.exports = { authenticate, authorizeRole };
// Role check middleware
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRole };
