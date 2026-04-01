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

    // ✅ FORM VALIDATION CHECK
    const isFormValid =
        shippingAddress.firstName &&
        shippingAddress.lastName &&
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.country &&
        shippingAddress.phone.length === 10 &&
        shippingAddress.postalCode.length >= 5;

    // Create checkout
    const handleCreateCheckout = async (e) => {
        e.preventDefault();

        if (shippingAddress.phone.length !== 10) {
            alert("Phone number must be exactly 10 digits");
            return;
        }

        if (shippingAddress.postalCode.length < 5) {
            alert("Enter a valid postal code");
            return;
        }

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

    // Finalize checkout
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

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* LEFT */}
            <div className="bg-white rounded-lg p-5 border border-[#E5E5E5]">
                <h2 className="text-[18px] font-medium mb-6">Checkout</h2>

                <form onSubmit={handleCreateCheckout}>
                    {/* EMAIL */}
                    <h3 className="text-[16px] font-medium mb-4">Contact</h3>
                    <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 text-[13px]"
                    />

                    {/* NAME */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={shippingAddress.firstName}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setShippingAddress({ ...shippingAddress, firstName: value });
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-md text-[13px]"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={shippingAddress.lastName}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setShippingAddress({ ...shippingAddress, lastName: value });
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-md text-[13px]"
                            required
                        />
                    </div>

                    {/* ADDRESS */}
                    <input
                        type="text"
                        placeholder="Address"
                        value={shippingAddress.address}
                        onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, address: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 text-[13px]"
                        required
                    />

                    {/* CITY + POSTAL */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                            }
                            className="px-3 py-2 border border-gray-200 rounded-md text-[13px]"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 6) {
                                    setShippingAddress({ ...shippingAddress, postalCode: value });
                                }
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-md text-[13px]"
                            required
                        />
                    </div>

                    {/* COUNTRY */}
                    <input
                        type="text"
                        placeholder="Country"
                        value={shippingAddress.country}
                        onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 text-[13px]"
                        required
                    />

                    {/* PHONE */}
                    <input
                        type="tel"
                        placeholder="Phone (10 digits)"
                        value={shippingAddress.phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                                setShippingAddress({ ...shippingAddress, phone: value });
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 text-[13px]"
                        required
                    />

                    {/* BUTTON */}
                    {!checkoutId ? (
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full bg-black text-white py-3 rounded-md text-[13px] disabled:bg-gray-400 cursor-pointer"
                        >
                            Continue to Payment
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <RazorpayButton
                                checkoutId={checkoutId}
                                amount={cart.totalPrice}
                                onPaymentSuccess={handleFinalizeCheckout}
                            />
                        </div>
                    )}
                </form>
            </div>

            {/* Right Section - Order Summary */}
            <div className="bg-gray-50 p-5 rounded-lg border border-[#E5E5E5] h-fit">
                <h3 className="text-[16px] font-medium mb-5">Order Summary</h3>
                <div className="space-y-4 mb-6">
                    {cart.products.map((product, i) =>
                    (<div key={i} className="flex items-center justify-between gap-4 py-2">
                        {/* Left: Image + Details */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border border-[#E5E5E5]" />
                                {/* Quantity badge */}
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                    {product.quantity}
                                </span>
                            </div>
                            <div className="max-w-[120px] sm:max-w-[180px]">
                                <h4 className="text-[14px] font-medium text-gray-900 truncate">
                                    {product.name}
                                </h4>
                                <p className="text-[12px] text-gray-500 uppercase">
                                    {product.color} / {product.size}
                                </p>
                            </div>
                        </div>
                        {/* Right: Price */}
                        <div className="text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            ${product.price?.toLocaleString() || "0"}
                        </div>
                    </div>))}
                </div>
                <div className="flex justify-between items-center mt-6 border-t border-gray-200 pt-4">
                    <span className="text-[16px] font-medium">
                        Total
                    </span>
                    <span className="text-[18px] font-medium text-gray-900">
                        $
                        {cart.totalPrice?.toLocaleString() || "0"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckOut;