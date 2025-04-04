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
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Error removing item" });
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
