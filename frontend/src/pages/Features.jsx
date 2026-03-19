import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiRefreshCw, FiAward, FiHeart, FiGlobe } from 'react-icons/fi';

const Features = () => {
    const featuresList = [
        {
            icon: <FiTruck className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Free Global Shipping",
            description: "Enjoy free standard shipping on all orders over $100. We deliver to over 50 countries worldwide with reliable tracking."
        },
        {
            icon: <FiRefreshCw className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Easy 30-Day Returns",
            description: "Not completely satisfied? Return your unworn items within 30 days for a full refund or exchange. No questions asked."
        },
        {
            icon: <FiShield className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Secure Checkout",
            description: "Your data is safe with us. Our checkout process is fully encrypted and we accept all major secure payment methods."
        },
        {
            icon: <FiAward className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Premium Quality",
            description: "We source only the finest sustainable materials. Our garments are designed to last, outliving seasonal trends."
        },
        {
            icon: <FiHeart className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Ethical Manufacturing",
            description: "We partner exclusively with factories that ensure fair wages, safe conditions, and sustainable practices."
        },
        {
            icon: <FiGlobe className="text-4xl mb-4 text-[#ea2e0e]" />,
            title: "Sustainable Packaging",
            description: "Our commitment to the planet extends to our packaging, which is 100% recyclable, compostable, or biodegradable."
        }
    ];

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="bg-white text-gray-900 min-h-screen py-16"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#ea2e0e]">Why Choose Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto hover:text-gray-300 transition-colors">
                        We're committed to providing the best shopping experience, from premium quality products to exceptional customer service.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {featuresList.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg hover:border-[#ea2e0e] transition-all group"
                            variants={itemVariants}
                        >
                            <div className="transform group-hover:scale-110 transition-transform duration-300 origin-left">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-gray-300 transition-colors">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="mt-20 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                >
                    <a
                        href="/collections/all"
                        className="inline-block bg-[#ea2e0e] text-white font-bold py-4 px-10 rounded-full hover:bg-red-700 hover:text-gray-300 transition-colors shadow-lg text-lg"
                    >
                        Shop Now
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Features;
