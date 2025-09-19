const jwt = require("jsonwebtoken");

module.exports.isAdmin = (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (!token) {
      return res.status(401).json({ message: "access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "access denied" });
    }

    req.user = decoded;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
