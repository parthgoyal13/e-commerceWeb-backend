const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: Object,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
