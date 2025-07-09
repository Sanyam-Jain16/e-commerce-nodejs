// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc Get user cart
// @route GET /api/cart
// @access Private
const getUserCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ cartItems: [] });
  res.json(cart);
};

// @desc Add or update cart item
// @route POST /api/cart
// @access Private
const addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, cartItems: [] });
  }

  const itemIndex = cart.cartItems.findIndex(
    (x) => x.product.toString() === productId
  );

  if (itemIndex >= 0) {
    cart.cartItems[itemIndex].qty = qty;
  } else {
    cart.cartItems.push({
      product: productId,
      name: product.name,
      qty,
      price: product.price,
      image: product.image,
    });
  }

  await cart.save();
  res.status(201).json(cart);
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.cartItems = cart.cartItems.filter(
    (x) => x.product.toString() !== productId
  );
  await cart.save();

  res.json(cart);
};

// @desc Clear cart
// @route DELETE /api/cart
// @access Private
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.cartItems = [];
  await cart.save();
  res.json({ message: "Cart cleared" });
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.qty = qty;

    await cart.save();

    res.status(200).json({
      message: "Cart item quantity updated",
      cartItems: cart.cartItems,
    });
  } catch (error) {
    console.error("❌ Error in updateCartItemQuantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
};
