const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
require("dotenv").config();

// Restrict to admins only
const restrictToAdmin = async (req, res, next) => {
    try {
      // Check for Authorization header
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message: "Authorization token is required in Bearer format",
          data: {},
        });
      }
  
      // Extract and verify token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if email exists in token payload
      if (!decoded.email) {
        return res.status(401).json({
          status: false,
          message: "Invalid token: Email not found in payload",
          data: {},
        });
      }
  
      // Find user by email
      const user = await User.findOne({ email: decoded.email }).select(
        "-password -verificationToken -verificationTokenExpires"
      );
  
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User with this email not found",
          data: {},
        });
      }
  
      // Check if user is admin
      if (user.role !== "admin") {
        return res.status(403).json({
          status: false,
          message: "Access denied: Admin privileges required",
          data: {},
        });
      }
  
      // Attach user to request object and proceed
      req.user = user;
      return next();
  
    } catch (error) {
      console.error("Authentication error:", error);
  
      // Handle specific JWT errors
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: false,
          message: "Invalid or malformed token",
          data: {},
        });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: false,
          message: "Token has expired",
          data: {},
        });
      }
  
      // Generic server error
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        data: {},
      });
    }
  };  

// Optional: Restrict to specific admin roles (e.g., Super Admin only)
const restrictToAdminRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (
      !req.user.role === "admin" ||
      !allowedRoles.includes(req.user.adminRole)
    ) {
      return res.status(403).json({
        status: false,
        message: `Access denied: Requires one of these admin roles: ${allowedRoles.join(
          ", "
        )}`,
        data: {},
      });
    }
    next();
  };

module.exports = { restrictToAdmin, restrictToAdminRole };
