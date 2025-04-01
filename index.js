const cors = require("cors");
const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connection");
const { Products } = require("./models/products.model");

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/products", async (req, res) => {
  try {
    const { category, subcategory, price, rating, sort } = req.query;

    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (price) query.price = { $lte: parseFloat(price) };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    let productsQuery = Products.find(query);

    if (sort === "lowToHigh") {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === "highToLow") {
      productsQuery = productsQuery.sort({ price: -1 });
    }

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await Products.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, category, subcategory, price, rating, image } = req.body;
    const newProduct = new Products({
      name,
      category,
      subcategory,
      price,
      rating,
      image,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Cannot post product data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
