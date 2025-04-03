const express = require("express");
const router = express.Router();
const Products = require("../models/products.model");

router.get("/", async (req, res) => {
  try {
    const { category, subcategory, price, rating, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (price) query.price = { $lte: parseFloat(price) };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    let productsQuery = Products.find(query);
    if (sort === "lowToHigh") productsQuery = productsQuery.sort({ price: 1 });
    else if (sort === "highToLow")
      productsQuery = productsQuery.sort({ price: -1 });

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const product = await Products.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = new Products(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Cannot add product" });
  }
});

module.exports = router;
