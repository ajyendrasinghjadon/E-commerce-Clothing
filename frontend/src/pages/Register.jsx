import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import register from "../assets/register.webp";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Register = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, cart, guestId, dispatch, navigate, isCheckoutRedirect]);

    // Clear error when user types
    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [name, email, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }))
            .unwrap()
            .then(() => {
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
            });
    };

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            className="flex"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-sm"
                >
                    <div className="flex justify-center mb-6">
                        <h2 className="text-[24px] font-medium tracking-tight">Rabbit</h2>
                    </div>

                    <h2 className="text-[18px] font-medium text-center mb-4">
                        Hey there! 👋
                    </h2>

                    <p className="text-center text-[14px] text-gray-600 mb-6">
                        Enter your username and password to Register.
                    </p>

                    {/* Name */}
                    <div className="mb-4">
                        <div className="block text-[13px] font-medium text-gray-900 mb-2">Name</div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Enter your Name"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <div className="block text-[13px] font-medium text-gray-900 mb-2">Email</div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-[13px] font-medium text-gray-900 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg text-[13px] font-medium hover:bg-gray-800 transition hover:cursor-pointer"
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>

                    <p className="mt-6 text-center text-[13px]">
                        Already have an account?{" "}
                        <Link
                            to={`/login?redirect=${encodeURIComponent(redirect)}`}
                            className="text-blue-500"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-auto flex flex-col justify-center items-center">
                    <img
                        src={register}
                        alt="Register your account"
                        className="h-165 w-full object-cover"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Register;