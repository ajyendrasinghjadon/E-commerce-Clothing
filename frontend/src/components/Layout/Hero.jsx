import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings } from "../../redux/slices/siteSettingsSlice";
import { FiEdit2 } from "react-icons/fi";
import ImageEditModal from "../Admin/ImageEditModal";
import heroImgLocal from "../../assets/rabbit-hero.webp";

const Hero = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.siteSettings);
    const { user } = useSelector((state) => state.auth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (!settings) {
            dispatch(fetchSiteSettings());
        }
    }, [dispatch, settings]);

    const heroImageUrl = settings?.heroImage?.url || heroImgLocal;

    if (loading && !settings) {
        return (
            <div className="w-full h-100 md:h-120 lg:h-187.5 bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-medium">Loading Hero...</span>
            </div>
        );
    }

    return (
        <section className="relative group">
            <motion.img
                src={heroImageUrl}
                alt="rabbit hero"
                className="w-full h-100 md:h-120 lg:h-187.5 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Admin Edit Overlay */}
            {user?.role === "admin" && (
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-20"
                >
                    <FiEdit2 size={18} />
                </button>
            )}

            <div className="absolute bg-black/5 inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                    <motion.h1
                        className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Vacation <br /> Ready
                    </motion.h1>
                    <motion.p
                        className="text-sm tracking-tighter md:text-lg mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Explore our vacation ready outfits with fast worldwide shipping.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link to="/collections/all" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg inline-block hover:scale-105 transition-transform duration-300">
                            Shop Now
                        </Link>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <ImageEditModal
                        field="heroImage"
                        currentUrl={heroImageUrl}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;