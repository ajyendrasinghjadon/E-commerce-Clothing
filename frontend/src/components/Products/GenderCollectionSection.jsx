import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import ImageEditModal from "../Admin/ImageEditModal";
import mensCollectionImageLocal from "../../assets/mens-collection2.webp";
import womensCollectionImageLocal from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
    const { settings, loading } = useSelector((state) => state.siteSettings);
    const { user } = useSelector((state) => state.auth);
    
    const [editTarget, setEditTarget] = useState(null); // { field, url }

    const womensImage = settings?.womensCollectionImage?.url || womensCollectionImageLocal;
    const mensImage = settings?.mensCollectionImage?.url || mensCollectionImageLocal;

    if (loading && !settings) {
        return (
            <section className="py-16 px-4 lg:px-0 mx-12">
                <div className="container mx-auto flex flex-col md:flex-row gap-8">
                    <div className="flex-1 h-175 bg-gray-100 animate-pulse rounded-lg" />
                    <div className="flex-1 h-175 bg-gray-100 animate-pulse rounded-lg" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 lg:px-0 mx-12 overflow-hidden">
            <div className="container mx-auto flex flex-col md:flex-row gap-8">
                {/* Women's collection */}
                <motion.div
                    className="relative flex-1 group overflow-hidden"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={womensImage}
                        alt="Women's Collection"
                        className="w-full h-175 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Admin Edit Overlay */}
                    {user?.role === "admin" && (
                        <button
                            onClick={() => setEditTarget({ field: "womensCollectionImage", url: womensImage })}
                            className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-20"
                        >
                            <FiEdit2 size={18} />
                        </button>
                    )}

                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className="text-[18px] font-medium text-gray-900 mb-2">
                            Women's Collection
                        </h2>
                        <Link to="collections/all?gender=Women"
                            className="text-gray-900 underline hover:text-gray-600 transition-colors text-[13px] font-medium"
                        >
                            Shop Now
                        </Link>
                    </div>
                </motion.div>

                {/* Men's collection */}
                <motion.div
                    className="relative flex-1 group overflow-hidden"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img
                        src={mensImage}
                        alt="Men's Collection"
                        className="w-full h-175 object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Admin Edit Overlay */}
                    {user?.role === "admin" && (
                        <button
                            onClick={() => setEditTarget({ field: "mensCollectionImage", url: mensImage })}
                            className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-20"
                        >
                            <FiEdit2 size={18} />
                        </button>
                    )}

                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className="text-[18px] font-medium text-gray-900 mb-2">
                            Men's Collection
                        </h2>
                        <Link to="collections/all?gender=Men"
                            className="text-gray-900 underline hover:text-gray-600 transition-colors text-[13px] font-medium"
                        >
                            Shop Now
                        </Link>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {editTarget && (
                    <ImageEditModal
                        field={editTarget.field}
                        currentUrl={editTarget.url}
                        onClose={() => setEditTarget(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default GenderCollectionSection;