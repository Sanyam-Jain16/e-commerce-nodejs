const express = require("express");
const { checkoutCart } = require("../controllers/checkoutController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, checkoutCart);

module.exports = router;
