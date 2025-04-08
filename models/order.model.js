const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
    address: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phoneNumber: String,
    },
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered"],
      default: "placed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
