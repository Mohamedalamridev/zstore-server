// middleware/authorization.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

module.exports.authorization = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userId = decoded.id;
    req.user = user; // هنا عندك كل بيانات اليوزر بما فيها role
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
