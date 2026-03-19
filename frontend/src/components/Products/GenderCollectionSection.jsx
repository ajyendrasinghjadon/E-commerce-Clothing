import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mensCollectionImage from "../../assets/mens-collection2.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
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
                        src={womensCollectionImage}
                        alt="Women's Collection"
                        className="w-full h-175 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Women's Collection
                        </h2>
                        <Link to="collections/all?gender=Women"
                            className="text-gray-900 underline hover:text-gray-600 transition-colors"
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
                        src={mensCollectionImage}
                        alt="Men's Collection"
                        className="w-full h-175 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Men's Collection
                        </h2>
                        <Link to="collections/all?gender=Men"
                            className="text-gray-900 underline hover:text-gray-600 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GenderCollectionSection;