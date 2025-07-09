// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(protect, getUserCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route("/:productId").put(protect, updateCartItemQuantity);
router.route("/:productId").delete(protect, removeFromCart);

module.exports = router;
