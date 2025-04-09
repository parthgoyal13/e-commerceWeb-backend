const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist.model");

router.get("/", async (req, res) => {
  try {
    const wishlist = await Wishlist.find();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newItem = new Wishlist(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const productIdToRemove = req.params.productId;

    const deletedItem = await Wishlist.findOneAndDelete({
      "products.productId": productIdToRemove,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    res.json({ message: "Product removed from wishlist", deletedItem });
  } catch (error) {
    res.status(500).json({ error: "Error removing product" });
  }
});

module.exports = router;
