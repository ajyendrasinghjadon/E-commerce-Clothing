const express = require("express");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();

// @route POST /api/contact
// @desc Send contact support email
// @access Public
router.post("/", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        sendEmail({
            to: process.env.EMAIL_FROM,
            subject: `Contact Support Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<h3>Contact Support Message</h3>
                   <p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong></p>
                   <p>${message}</p>`,
        });

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

module.exports = router;
