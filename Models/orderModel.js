// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  paymobOrderId: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  address: {
    name: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "EG" },
    phone: { type: String },
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
