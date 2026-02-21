import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider
            options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                currency: "USD",   // 🔥 REQUIRED
                intent: "capture"
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: "USD",  // 🔥 MUST MATCH ABOVE
                                value: parseFloat(amount).toFixed(2),
                            },
                        }],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess);
                }}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;