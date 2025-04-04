const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    image: String,
    price: Number,
    rating: Number,
  },
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
