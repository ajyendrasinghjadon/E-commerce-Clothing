import React from "react";
import axios from "axios";

const RazorpayButton = ({ checkoutId, amount, onPaymentSuccess }) => {
    const handlePayment = async () => {
        try {
            // 1️⃣ Get user token from localStorage
            const token = localStorage.getItem("userToken");
            if (!token) {
                alert("Please login to proceed with payment.");
                return;
            }

            // 2️⃣ Create Razorpay order on backend
            const orderResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/create-razorpay-order`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { id: order_id, amount: order_amount, currency } = orderResponse.data;

            // 3️⃣ Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
                amount: order_amount, // in paise
                currency: currency,
                name: "Your Store Name",
                description: "Purchase",
                order_id: order_id,
                handler: async function (response) {
                    // 4️⃣ Payment succeeded, notify backend
                    try {
                        await axios.put(
                            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                            {
                                paymentStatus: "paid",
                                paymentDetails: response,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        // 5️⃣ Call parent callback if provided
                        if (onPaymentSuccess) onPaymentSuccess(response);

                        alert("Payment Successful!");
                    } catch (error) {
                        console.error("Error updating payment:", error);
                        alert("Payment succeeded but updating backend failed.");
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#000000",
                },
            };

            // 6️⃣ Open Razorpay checkout
            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert("Payment failed. Please try again.");
            });
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Error creating Razorpay order. Please try again.");
        }
    };

    return (
        <button
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            onClick={handlePayment}
        >
            Pay Now
        </button>
    );
};

export default RazorpayButton;