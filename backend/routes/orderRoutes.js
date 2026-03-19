const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const razorpay = require("../config/razorpay");
const router = express.Router();
const Checkout = require("../models/Checkout");

// @route POST /api/checkout/:id/create-razorpay-order
// @access Private
router.post("/:id/create-razorpay-order", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    const options = {
      amount: checkout.totalPrice * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${checkout._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by most recent order
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/orders/:id
// @desc vGet order details by Id
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
