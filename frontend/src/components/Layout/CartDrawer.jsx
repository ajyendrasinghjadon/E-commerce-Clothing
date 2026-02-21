import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const userId = user ? user._id : null;

    const handleCheckout = () => {
        toggleCartDrawer();
        if (!user) {
            navigate("/login?redirect=checkout");
        } else {
            navigate("/checkout");
        }
    };

    // ✅ Calculate Subtotal Safely
    const subtotal = cart?.products?.reduce((acc, item) => {
        const price = item.discountPrice || item.price || 0;
        const quantity = item.quantity || 0;
        return acc + price * quantity;
    }, 0) || 0;

    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [drawerOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={toggleCartDrawer}
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 
                ${drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full 
                w-[85%] sm:w-105
                bg-white shadow-2xl
                flex flex-col
                transform transition-transform duration-300 ease-in-out 
                z-50
                ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <h2 className="text-lg font-semibold tracking-wide">
                        Your Cart
                    </h2>

                    <button
                        onClick={toggleCartDrawer}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <IoMdClose className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Scrollable Cart Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {cart && cart?.products?.length > 0 ? (
                        <CartContent
                            cart={cart}
                            userId={userId}
                            guestId={guestId}
                        />
                    ) : (
                        <p>Your Cart Is Empty.</p>
                    )}
                </div>

                {/* Footer / Checkout Section */}
                <div className="p-5 border-t border-gray-200 bg-white">
                    {cart && cart?.products?.length > 0 && (
                        <>
                            {/* Subtotal */}
                            <div className="flex justify-between mb-4 text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-3 rounded-lg 
                                font-semibold hover:bg-gray-900 
                                transition-all duration-200 active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Shipping, taxes and discount codes calculated at checkout.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;