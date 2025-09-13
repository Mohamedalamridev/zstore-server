const jwt = require("jsonwebtoken");
module.exports.checkAuthontication = async (req, res) => {
  const token = req.cookies["access-token"];

  return token !== null;
};
