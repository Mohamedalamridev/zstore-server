const mongoose = require("mongoose");
const userModel = require("../Models/User");
const ordersModel = require("../Models/orderModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email: email });
    if (exists !== null) {
      return res.status(400).json({ message: "this Email already exists" });
    }
    const hashdPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashdPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "sign up upsuccessfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist = await userModel.findOne({ email: email });

    if (!exist) {
      return res.status(403).json({ message: "Incorrect credintial" });
    }
    const comparePassowrd = await bcrypt.compare(password, exist.password);
    if (!comparePassowrd) {
      return res.status(403).json({ message: "Incorrect credential" });
    }
    const token = jwt.sign({ id: exist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const user = await userModel
      .findOne({ _id: exist._id })
      .select("-password");
    return res
      .cookie("access-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 10000,
      })
      .json({ message: "login success", profile: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await ordersModel.find({
      userId: new mongoose.Types.ObjectId(String(userId)),
    });
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: user, orders: orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("access-token").json({ message: "logout success" });
};

module.exports.updateAddress = async (req, res) => {
  try {
    const user = userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    user.addresses = [...addresses, req.body];
    await user.save();
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
