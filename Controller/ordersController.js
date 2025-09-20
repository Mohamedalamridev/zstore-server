const orderModel = require("../Models/orderModel");

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ orderId: req.userId });
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getOrdersForAdmin = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("userId", "email name");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
