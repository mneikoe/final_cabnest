const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware - verify JWT and get user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user by decoded id, exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin role middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as an admin" });
};

// Student role middleware - async for DB check
const student = async (req, res, next) => {
  try {
    // Fetch fresh user from DB to ensure latest role
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Not authorized as a student",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Student authorization failed",
    });
  }
};

module.exports = { protect, admin, student };
