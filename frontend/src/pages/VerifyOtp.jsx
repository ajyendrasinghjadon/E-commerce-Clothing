import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyOtp, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector((state) => state.auth);
    const email = new URLSearchParams(location.search).get("email");

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ email, otp }))
            .unwrap()
            .then(() => {
                toast.success("Email verified successfully! Please login.");
                navigate("/login");
            })
            .catch((err) => {
                toast.error(err.message || "Verification failed");
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center min-h-[70vh] p-4"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-sm text-center">
                <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
                <p className="text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to <strong>{email}</strong>. It expires in 3 minutes.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            if (error) dispatch(clearError());
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[1em] mb-6 outline-none focus:border-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500">
                    Didn't receive the OTP?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="text-black font-semibold hover:underline"
                    >
                        Try Registering Again
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default VerifyOtp;
