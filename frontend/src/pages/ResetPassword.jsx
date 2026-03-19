import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { resetPassword, resendResetOtp, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector((state) => state.auth);
    const email = new URLSearchParams(location.search).get("email");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleResend = () => {
        dispatch(resendResetOtp(email))
            .unwrap()
            .then(() => {
                toast.success("New OTP sent to your email!");
                setTimer(120);
            })
            .catch((err) => {
                toast.error(err.message || "Failed to resend OTP");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        dispatch(resetPassword({ email, otp, newPassword }))
            .unwrap()
            .then(() => {
                toast.success("Password reset successful! Please login.");
                navigate("/login");
            })
            .catch((err) => {
                toast.error(err.message || "Reset failed");
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
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter the OTP sent to <strong>{email}</strong> and your new password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                        <label className="block text-sm font-semibold mb-2">OTP</label>
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="6-digit OTP"
                            className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest outline-none focus:border-black"
                            required
                        />
                        <div className="mt-2">
                            {timer > 0 ? (
                                <p className="text-sm text-gray-500">Resend OTP in <span className="font-mono font-bold text-black">{formatTime(timer)}</span></p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-sm text-black font-semibold hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="Enter new password"
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="Confirm new password"
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPassword;
