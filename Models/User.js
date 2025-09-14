const mongoose = require("mongoose");

const productInOrderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        label: { type: String, default: "Home" },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: "EG" },
        phone: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
