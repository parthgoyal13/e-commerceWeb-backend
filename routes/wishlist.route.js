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
// Remove product from wishlist (by productId)
router.delete("/:productId", async (req, res) => {
  try {
    const productIdToRemove = req.params.productId;

    const updatedWishlist = await Wishlist.findOneAndUpdate(
      {},
      { $pull: { products: { productId: productIdToRemove } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json({ message: "Product removed from wishlist", updatedWishlist });
  } catch (error) {
    res.status(500).json({ error: "Error removing product" });
  }
});

module.exports = router;
