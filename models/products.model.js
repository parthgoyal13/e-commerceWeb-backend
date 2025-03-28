const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: false },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
});
const Products = mongoose.model("Products", productsSchema);
module.exports = { Products };
