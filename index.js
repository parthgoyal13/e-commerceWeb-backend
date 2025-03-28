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
    const allProducts = await Products.find();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  console.log("Received data:", req.body);
  const { name, category, subcategory, price, rating, image } = req.body;
  try {
    const productsData = new Products({
      name,
      category,
      subcategory,
      price,
      rating,
      image,
    });
    await productsData.save();
    res.status(201).json(productsData);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Can not post products data" });
  }
});

app.get("/products/:productId", async (req, res) => {
  const productId = req.params.productId;
  const productById = await Products.findById(productId);
  res.json(productById);
});

app.get("/products/productscategory/:productsCategory", async (req, res) => {
  const productsCategory = req.params.productsCategory;
  console.log("Requested category:", productsCategory);

  try {
    const selectedCategory = await Products.find({
      category: productsCategory,
    });
    res.json(selectedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error category not found" });
  }
});

app.get("/products/category/:productsSubCategory", async (req, res) => {
  const productsSubCategory = req.params.productsSubCategory;
  console.log("Requested subcategory:", productsSubCategory);

  try {
    const selectedSubcategory = await Products.find({
      subcategory: productsSubCategory,
    });
    res.json(selectedSubcategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error subcategory not found" });
  }
});

app.get("/products/productsprice/:productsPrice", async (req, res) => {
  const productsPrice = req.params.productsPrice;
  console.log("Requested product price:", productsPrice);

  try {
    const selectedPrice = await Products.find({
      price: productsPrice,
    });
    res.json(selectedPrice);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error products with price not found" });
  }
});

app.get("/products/rating/:productsRating", async (req, res) => {
  const productsRating = req.params.productsRating;
  console.log("Requested productsRating:", productsRating);

  try {
    const selectedProductsRating = await Products.find({
      rating: productsRating,
    });
    res.json(selectedProductsRating);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error subcategory not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
