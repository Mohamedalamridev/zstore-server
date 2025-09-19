const mongoose = require("mongoose");
const userModel = require("../Models/User");
const ordersModel = require("../Models/orderModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res.status(400).json({ message: "This email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Remove password from response
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    return res
      .status(201)
      .json({ message: "Sign up successful", user: userResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res
      .cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        profile: userWithoutPassword,
        isLogin: true,
      });
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

    return res
      .status(200)
      .json({ user, orders, isLogin: true, role: user.role });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("access-token").json({ message: "Logout successful" });
};

// ِAddresses

module.exports.addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const newAddress = req.body;
    console.log(newAddress);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existsAddress = user.addresses.find(
      (item) => item?.label === newAddress?.label
    );
    if (existsAddress) {
      return res.status(400).json({ message: "This Label already exists" });
    }
    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({
      message: "Address added successfully",
      user,
    });
  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not fond" });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }
    address.deleteOne();
    await user.save();

    return res.json({
      message: "Address deleted successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    Object.assign(address, updatedData);
    await user.save();

    res.json({
      message: "Address updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.checkRole = async (req, res) => {
  try {
    const role = req.role;
    if (role === "Admin") {
      return true;
    }
    return res.status(200).json({ state: true });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
