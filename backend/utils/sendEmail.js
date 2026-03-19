const sgMail = require("@sendgrid/mail");

// We intentionally do NOT set the API key at the top level so that the app doesn't crash if the key is missing at startup
// The key will be set right before sending if it exists.

/**
 * Sends an email using SendGrid.
 * Operates as a fire-and-forget to prevent blocking API responses.
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = ({ to, subject, text, html }) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn("[SendGrid] Missing SENDGRID_API_KEY. Email not sent.");
        return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const fromAddress = process.env.EMAIL_FROM || "noreply@yourstore.com";

    const msg = {
        to,
        from: {
            email: fromAddress,
            name: "Rabbit E-commerce",
        },
        subject,
        text,
        html,
    };

    // Asynchronously send the email so the response is not blocked
    sgMail.send(msg)
        .then(() => {
            console.log(`[SendGrid] Email sent successfully to: ${to}`);
        })
        .catch((error) => {
            console.error(`[SendGrid] Error sending email to ${to}:`, error.message);
            if (error.response) {
                console.error("[SendGrid Error Details]:", JSON.stringify(error.response.body, null, 2));
            }
        });
        
    // Return void or a success indicator immediately
    return true;
};

module.exports = sendEmail;
