import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const CheckOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    // Redirect if cart empty
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    // Create checkout in backend
    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "razorpay",
                    totalPrice: cart.totalPrice,
                })
            );
            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
            }
        }
    };

    // Finalize checkout after payment
    const handleFinalizeCheckout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            navigate("/order-confirmation");
        } catch (err) {
            console.error(err);
            alert("Error finalizing checkout");
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error loading cart: {error}</p>;
    if (!cart || cart.products.length === 0) return <p>Your cart is empty.</p>;

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    {/* Contact Details */}
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user ? user.email : ""}
                            className="w-full p-2 border border-gray-200 rounded"
                            disabled
                        />
                    </div>

                    {/* Delivery Address */}
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={shippingAddress.firstName}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                            }
                            className="w-full p-2 border border-gray-200 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={shippingAddress.lastName}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                            }
                            className="w-full p-2 border border-gray-200 rounded"
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Address"
                        value={shippingAddress.address}
                        onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, address: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded mb-4"
                        required
                    />
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                            }
                            className="w-full p-2 border border-gray-200 rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                            }
                            className="w-full p-2 border border-gray-200 rounded"
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Country"
                        value={shippingAddress.country}
                        onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded mb-4"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded mb-4"
                        required
                    />

                    {/* Payment Section */}
                    <div className="mt-6 hover:cursor-pointer">
                        {!checkoutId ? (
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded"
                            >
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4">Pay with Razorpay</h3>
                                <RazorpayButton
                                    checkoutId={checkoutId}
                                    amount={cart.totalPrice}
                                    onPaymentSuccess={handleFinalizeCheckout}
                                />

                                {/* 👇 TEST PAYMENT BUTTON */}
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem("userToken");
                                            // Mark checkout as paid (mock)
                                            await axios.put(
                                                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                                                {
                                                    paymentStatus: "paid",
                                                    paymentDetails: { mock: true },
                                                },
                                                {
                                                    headers: { Authorization: `Bearer ${token}` },
                                                }
                                            );

                                            // Finalize checkout
                                            await axios.post(
                                                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                                                {},
                                                {
                                                    headers: { Authorization: `Bearer ${token}` },
                                                }
                                            );

                                            alert("Success! Payment completed (Test Mode). Redirecting...");
                                            navigate("/order-confirmation");
                                        } catch (err) {
                                            console.error("Mock Payment Error:", err);
                                            alert("Payment failed. Please try again.");
                                        }
                                    }}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors font-semibold shadow-md"
                                >
                                    Confirm Test Payment
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                {cart.products.map((product, i) => (
                    <div key={i} className="flex items-start justify-between py-2 border-b border-gray-300">
                        <div className="flex items-start">
                            <img
                                src={product.image || "https://via.placeholder.com/150"}
                                alt={product.name}
                                className="w-24 h-24 object-cover mr-4 rounded shadow-sm"
                            />
                            <div>
                                <h3 className="text-md font-medium">{product.name}</h3>
                                <p className="text-gray-500 text-sm">Size: {product.size || "N/A"}</p>
                                <p className="text-gray-500 text-sm">Color: {product.color || "N/A"}</p>
                            </div>
                        </div>
                        <p className="text-xl font-semibold">${product.price?.toLocaleString() || "0"}</p>
                    </div>
                ))}
                <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4 font-bold text-gray-900">
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString() || "0"}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckOut;