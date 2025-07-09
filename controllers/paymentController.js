const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { orderItems, user } = req.body;

  try {
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image], // must be a hosted image URL
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    }));

    const session = await Stripe.customers.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      customer_email: user.email,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCheckoutSession,
};
