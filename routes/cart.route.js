const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");

router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, image, price, rating, quantity } = req.body;

    const existingItem = await Cart.findOne({ name });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

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

router.delete("/", async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.status(200).json({ message: "All cart items removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item deleted successfully", item: deletedItem });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting cart item" });
  }
});

module.exports = router;
