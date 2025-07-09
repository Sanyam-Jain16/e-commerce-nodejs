const protect = require("../middlewares/authMiddleware");
const { createCheckoutSession } = require("../controllers/paymentController");

const express = require("express");

const router = express.Router();

router.post("/stripe", protect, createCheckoutSession);

module.exports = router;
