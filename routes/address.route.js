const express = require("express");
const router = express.Router();
const Address = require("../models/address.model");

// Get all addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching addresses" });
  }
});

// Get addresses by userId (NEW)
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const addresses = await Address.find({ userId: req.params.userId });
//     res.json(addresses);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: error.message || "Error fetching user addresses" });
//   }
// });

// Add a new address
router.post("/", async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: "Error adding address" });
  }
});

// Update an address
router.put("/:id", async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: "Error updating address" });
  }
});

// Delete an address
router.delete("/:id", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting address" });
  }
});

module.exports = router;
