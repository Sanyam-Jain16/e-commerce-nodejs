// controllers/checkoutController.js

const Cart = require("../models/Cart");
const Order = require("../models/Order");
// const Product = require("../models/Product");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

exports.checkoutCart = async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;

  if (
    !paymentMethod ||
    !shippingAddress?.address ||
    !shippingAddress?.city ||
    !shippingAddress?.postalCode ||
    !shippingAddress?.country
  ) {
    return res
      .status(400)
      .json({ message: "Shipping address and payment method are required" });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "cartItems.product"
    );
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.cartItems) {
      const product = item.product;

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product._id} is unavailable.` });
      }

      if (item.qty > product.countInStock) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.qty;

      orderItems.push({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      });

      product.countInStock -= item.qty;
      await product.save();
    }

    const newOrder = await Order.create({
      user: userId,
      orderItems: orderItems,
      totalAmount,
      status: "Processing",
      shippingAddress,
      paymentMethod,
    });

    await Cart.updateOne({ user: userId }, { $set: { cartItems: [] } });

    const user = await User.findById(userId);
    await sendEmail(
      user.email,
      "Your Order Confirmation",
      `
        <h2>Order Confirmed</h2>
        <p>Hi ${user.name}, your order #${newOrder._id} has been successfully placed.</p>
        <p>Total: ₹${totalAmount}</p>
      `
    );

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error during checkout" });
  }
};
