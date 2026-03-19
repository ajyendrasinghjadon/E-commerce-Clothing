import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <motion.div
            className="bg-white text-gray-900 min-h-screen py-16"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                {/* Introduction Section */}
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#ea2e0e]">About Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-300 transition-colors">
                        We are more than just a clothing brand. We are a community of fashion enthusiasts dedicated to bringing you the best in contemporary style, quality, and comfort.
                    </p>
                </motion.div>

                {/* Mission and Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        className="bg-white p-10 rounded-2xl shadow-lg border border-gray-300 group"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <div className="w-16 h-1 bg-[#ea2e0e] mb-6"></div>
                        <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                            To empower individuals to express their unique identity through accessible, high-quality fashion. We strive to create clothing that makes you feel confident, comfortable, and ready to take on the world, while maintaining sustainable and ethical practices in everything we do.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-10 rounded-2xl shadow-lg border border-gray-300 group"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                        <div className="w-16 h-1 bg-[#ea2e0e] mb-6"></div>
                        <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                            To become the global destination for modern fashion, recognized for our commitment to quality, innovation, and customer satisfaction. We envision a future where style and sustainability go hand in hand, inspiring positive change in the fashion industry.
                        </p>
                    </motion.div>
                </div>

                {/* Brand Story Section */}
                <motion.div
                    className="bg-gray-50 p-10 md:p-14 rounded-3xl border border-gray-300 shadow-sm"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#ea2e0e]">Our Brand Story</h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-left group">
                            <p className="hover:text-gray-300 transition-colors">
                                Founded in 2026, our journey began with a simple observation: modern fashion often forces people to choose between style, quality, and affordability. We believed there had to be a better way.
                            </p>
                            <p className="hover:text-gray-300 transition-colors">
                                What started as a small capsule collection has grown into a comprehensive wardrobe destination. Every piece we create is designed with you in mind—versatile enough for your everyday life, yet distinguished enough to make a statement.
                            </p>
                            <p className="hover:text-gray-300 transition-colors">
                                We work directly with skilled artisans and premium manufacturers to cut out the middlemen, bringing you unparalleled quality at accessible price points. Our design team focuses on timeless silhouettes combined with contemporary details, ensuring that our garments outlast seasonal trends.
                            </p>
                            <p className="font-medium text-gray-900 pt-4">
                                Thank you for being part of our story. We're excited to be part of yours.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default About;
