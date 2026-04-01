import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyOtp, resendOtp, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(180); // 3 minutes
    const [canResend, setCanResend] = useState(false);
    
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

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

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

    const handleResend = () => {
        dispatch(resendOtp(email))
            .unwrap()
            .then(() => {
                toast.success("A new OTP has been sent to your email.");
                setTimer(180);
                setCanResend(false);
            })
            .catch((err) => {
                toast.error(err.message || "Failed to resend OTP");
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-[75vh] p-6 bg-white"
        >
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-10">
                    <h1 className="text-[28px] font-medium tracking-tight mb-2 uppercase">Verify Email</h1>
                    <p className="text-[14px] text-gray-500">
                        We've sent a 6-digit code to <br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="000000"
                            className="w-full text-center text-[32px] tracking-[0.5em] font-light py-4 border-b border-gray-200 outline-none focus:border-[#ea2e0e] transition-colors placeholder:text-gray-100"
                            required
                        />
                        <div className="mt-4 p-3 bg-gray-50 rounded-sm border border-gray-100">
                            <p className="text-[12px] text-gray-500 leading-relaxed text-center">
                                <span className="font-medium text-[#ea2e0e]">Note:</span> Please check your <span className="font-medium text-gray-900">Spam / Junk</span> folder if you don't see the email in your inbox.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-black text-white py-4 rounded-sm text-[13px] font-medium tracking-wide uppercase hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[14px] text-gray-500 mb-2">
                        {canResend ? "Didn't receive the code?" : `Resend code in ${formatTime(timer)}`}
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={!canResend || loading}
                        className={`text-[13px] font-medium uppercase tracking-wider transition-colors ${
                            canResend 
                                ? "text-[#ea2e0e] hover:text-[#c0260b] cursor-pointer" 
                                : "text-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Resend OTP
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <button 
                        onClick={() => navigate("/register")}
                        className="text-[12px] text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-tight"
                    >
                        Back to registration
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VerifyOtp;

