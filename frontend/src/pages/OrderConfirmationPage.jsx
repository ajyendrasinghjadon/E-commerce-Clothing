import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { checkout, loading } = useSelector((state) => state.checkout);

  // Clear cart only after valid checkout exists
  useEffect(() => {
    if (checkout?._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [checkout, dispatch]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  // Optional loading state (recommended if using async checkout)
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold">Loading order...</h2>
      </div>
    );
  }

  // If no order found
  if (!checkout || !checkout._id) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">No order found</h2>
        <button
          onClick={() => navigate("/my-orders")}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:cursor-pointer"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

    return (
        <motion.div
            className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-[80vh]"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <div className="flex flex-col items-center justify-center text-center mb-12 mt-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-[28px] font-medium text-gray-900 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-[14px] text-gray-600">
                    Thank you for your purchase. We've received your order and are processing it.
                </p>
            </div>

            <div className="space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
                        <div>
                            <p className="text-[12px] text-gray-500 uppercase tracking-tight font-medium">Order ID</p>
                            <h2 className="text-[16px] font-medium text-gray-900 break-all">
                                #{checkout._id}
                            </h2>
                        </div>
                        <div className="sm:text-right">
                             <p className="text-[12px] text-gray-500 uppercase tracking-tight font-medium">Order Date</p>
                            <p className="text-gray-900 text-[14px] font-medium">
                                {new Date(checkout.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-between">
                         <div>
                            <p className="text-emerald-800 text-[13px] font-medium">Estimated Delivery</p>
                            <p className="text-emerald-700 text-[12px] uppercase tracking-tight">
                                {calculateEstimatedDelivery(checkout.createdAt)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-emerald-800 text-[13px] font-medium">Order Total</p>
                            <p className="text-[18px] font-medium text-emerald-900">${checkout.totalPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Ordered Items Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-[16px] font-medium text-gray-900 mb-6">Items Ordered</h3>
                    <div className="space-y-4">
                        {checkout.checkoutItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                            >
                                <div className="relative group">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[14px] font-medium text-gray-900 truncate">{item.name}</h4>
                                    <p className="text-[13px] text-gray-500">
                                        Variant: <span className="text-gray-900">{item.color} / {item.size}</span>
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[14px] font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-[12px] text-gray-500">
                                        ${item.price} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment & Delivery Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Payment */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-[13px] text-gray-500 uppercase tracking-tight font-medium mb-3">
                            Payment Details
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold">
                                    {checkout.paymentMethod || "Razorpay / Online"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Transaction processed securely</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-[13px] text-gray-500 uppercase tracking-tight font-medium mb-3">
                            Delivery Address
                        </h4>
                        <div className="flex items-start gap-3">
                             <div className="p-2 bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div className="text-gray-900">
                                <p className="font-medium text-[14px]">{checkout.shippingAddress?.address}</p>
                                <p className="text-[13px] text-gray-600">
                                    {checkout.shippingAddress?.city}, {checkout.shippingAddress?.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="px-8 py-4 bg-black text-white rounded-md text-[13px] font-medium hover:bg-gray-800 transition-all shadow-md text-center"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-md text-[13px] font-medium hover:bg-gray-50 transition-all text-center"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderConfirmationPage;