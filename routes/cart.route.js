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

// Add or update item in cart - CORRECTED
router.post("/", async (req, res) => {
  try {
    const { productId, name, image, price, rating, quantity } = req.body; // CHANGED: Added productId

    // CHANGED: Now checking by productId instead of name
    const existingItem = await Cart.findOne({ productId });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const newItem = new Cart({
      productId,
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
  const { id } = req.params;
  try {
    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err });
  }
});

// Update quantity
router.put("/:id", async (req, res) => {
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
