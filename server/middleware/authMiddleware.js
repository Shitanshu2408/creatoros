const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader) {
      console.log("No Authorization header");
      return res.status(401).json({
        error: "Access denied. No token."
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      console.log("Invalid Authorization format");
      return res.status(401).json({
        error: "Invalid token format"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("Token missing after Bearer");
      return res.status(401).json({
        error: "Token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info
    req.user = decoded;

    next();

  } catch (err) {

    console.log("JWT VERIFY FAILED:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token"
    });

  }
};