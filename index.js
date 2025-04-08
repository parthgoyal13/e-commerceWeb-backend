const cors = require("cors");
const express = require("express");
const { initializeDatabase } = require("./db/db.connection");

const productRoutes = require("./routes/products.route");
const wishlistRoutes = require("./routes/wishlist.route");
const cartRoutes = require("./routes/cart.route");
const addressRoutes = require("./routes/address.route");
const orderRoutes = require("./routes/order.routes");
const userAuthRoutes = require("./routes/userAuth.route");

const app = express();
// Allow frontend running on localhost:5173
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-web-frontend-dun.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/address", addressRoutes);
app.use("/orders", orderRoutes);
app.use("/userAuth", userAuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
