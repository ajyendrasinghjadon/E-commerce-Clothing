const express = require("express");
const sendEmail = require("../utils/sendEmail");
const Razorpay = require("razorpay");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({
      message: "No items in checkout",
    });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout session:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/create-razorpay-order
// @desc Create a Razorpay order for given checkout ID
// @access Private
router.post("/:id/create-razorpay-order", protect, async (req, res) => {
  try {
    const checkoutId = req.params.id;
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Create Razorpay order options
    const options = {
      amount: Math.round(checkout.totalPrice * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_order_${checkoutId}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Create final order based on checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      // Mark checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Send Order Confirmation Email to User
      try {
        sendEmail({
          to: req.user.email,
          subject: `Order Confirmation - #${finalOrder._id}`,
          text: `Thank you for your order! Your order ID is ${finalOrder._id}. Total Price: ₹${finalOrder.totalPrice}`,
          html: `<h1>Order Confirmation</h1>
                 <p>Hi ${req.user.name},</p>
                 <p>Thank you for shopping with us! Your order <strong>#${finalOrder._id}</strong> has been placed successfully.</p>
                 <p><strong>Total Amount:</strong> ₹${finalOrder.totalPrice}</p>
                 <p>We will notify you once your order is shipped.</p>`,
        });
      } catch (err) {
        console.error(`[Checkout] Failed to send confirmation email: ${err.message}`);
      }

      // Send Notification Email to Admin
      try {
        sendEmail({
          to: process.env.EMAIL_FROM,
          subject: `New Order Received - #${finalOrder._id}`,
          text: `A new order has been placed by ${req.user.name} (${req.user.email}). Total: ₹${finalOrder.totalPrice}`,
          html: `<h1>New Order Received</h1>
                 <p><strong>Order ID:</strong> #${finalOrder._id}</p>
                 <p><strong>Customer:</strong> ${req.user.name} (${req.user.email})</p>
                 <p><strong>Total Price:</strong> ₹${finalOrder.totalPrice}</p>
                 <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders">View Order in Dashboard</a></p>`,
        });
      } catch (err) {
        console.error(`[Checkout] Failed to send admin notification: ${err.message}`);
      }

      // Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;