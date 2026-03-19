import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { forgotPassword, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email))
            .unwrap()
            .then(() => {
                toast.success("OTP sent! Check your email.");
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            })
            .catch((err) => {
                toast.error(err.message || "Failed to send OTP");
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center min-h-[70vh] p-4"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="example@mail.com"
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;
