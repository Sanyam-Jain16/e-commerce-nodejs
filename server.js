const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON requests
app.use(cookieParser());

// Test Route
app.get("/", (_req, res) => {
  res.send("<h1>E-commerce app</h1>");
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment", paymentRoutes);

// Server listen
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT || 5000}`);
});

// retryWrites=true&w=majority&appName=Cluster0
