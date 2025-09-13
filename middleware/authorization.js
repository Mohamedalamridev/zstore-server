const jwt = require("jsonwebtoken");
module.exports.authorization = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (!token) {
      return res.status(401).send("Access Denied");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
};
