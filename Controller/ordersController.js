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
