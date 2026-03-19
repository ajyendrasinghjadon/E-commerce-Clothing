const express = require("express");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    //Check if the email is laready subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "email is already subscribed" });
    }

    //Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send Subscription Confirmation Email
    try {
      sendEmail({
        to: email,
        subject: "Welcome to Rabbit E-commerce Newsletter!",
        text: "Thank you for subscribing to our newsletter! You will now receive updates on our latest products and offers.",
        html: `<h1>Welcome!</h1>
               <p>Thank you for subscribing to the <strong>Rabbit E-commerce</strong> newsletter.</p>
               <p>You will now be the first to know about our latest collections and exclusive offers!</p>`,
      });
    } catch (err) {
      console.error(`[Subscribe] Failed to send confirmation email: ${err.message}`);
    }

    res.status(201).json({message: "Successfully subscribed to the newsletter"})
  } catch (error) {
    console.error(error)
    res.status(500).json({ emssage: "Server Error"})
  }
});

module.exports = router