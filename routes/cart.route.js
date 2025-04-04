const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");

// Get all cart items
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const { name, image, price, rating, quantity } = req.body;

    const newItem = new Cart({
      name,
      image,
      price,
      rating,
      quantity: quantity || 1,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// Remove item from cart
router.delete("/cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" }); // 🔧 fix: return 404 for missing item
    }
    return res.status(200).json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating quantity" });
  }
});

module.exports = router;
