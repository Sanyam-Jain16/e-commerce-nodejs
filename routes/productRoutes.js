const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.get("/", getAllProducts);
router.get("/top", getTopProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

// Add review to product
router.post("/:id/reviews", protect, createProductReview);

module.exports = router;
