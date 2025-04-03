const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist.model");

// Get all wishlist items
router.get("/", async (req, res) => {
  try {
    const wishlist = await Wishlist.find();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

// Add item to wishlist
router.post("/", async (req, res) => {
  try {
    const newItem = new Wishlist(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

// Remove item from wishlist
router.delete("/:id", async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Error removing item" });
  }
});

module.exports = router;
