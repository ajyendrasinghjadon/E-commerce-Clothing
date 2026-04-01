import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteSettings } from '../redux/slices/siteSettingsSlice';
import { FiEdit2 } from 'react-icons/fi';
import ImageEditModal from '../components/Admin/ImageEditModal';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const About = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.siteSettings);
    const { user } = useSelector((state) => state.auth);
    const [editTarget, setEditTarget] = useState(null); // { field, url }

    useEffect(() => {
        if (!settings) {
            dispatch(fetchSiteSettings());
        }
    }, [dispatch, settings]);

    const heroImage = settings?.aboutUsHeroImage?.url || "https://picsum.photos/1400/500?random=2";
    const storyImage = settings?.aboutUsStoryImage?.url || "https://picsum.photos/600/700?random=1";
    const brandImage = settings?.aboutUsBrandImage?.url || "https://picsum.photos/600/700?random=3";

    if (loading && !settings) {
        return (
            <div className="max-w-[1100px] mx-auto px-6 py-16 space-y-16">
                <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="h-64 bg-gray-100 animate-pulse rounded-sm" />
                    <div className="h-64 bg-gray-100 animate-pulse rounded-sm" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white text-gray-900 min-h-screen"
            initial="hidden"
            animate="visible"
            variants={stagger}
        >
            {/* HERO */}
            <section className="py-16 px-6">
                <div className="max-w-[1100px] mx-auto">
                    <motion.div variants={fadeUp} className="relative group">
                        <img
                            src={heroImage}
                            alt="About Hero"
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-sm"
                        />
                        {user?.role === "admin" && (
                            <button
                                onClick={() => setEditTarget({ field: "aboutUsHeroImage", url: heroImage })}
                                className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-10"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        )}
                    </motion.div>

                    <motion.div className="text-center mt-8" variants={fadeUp}>
                        <h1 className="text-[28px] font-medium tracking-tight text-[#ea2e0e]">
                            About Us
                        </h1>
                        <p className="text-[14px] text-gray-600 mt-2">
                            Modern style. Thoughtful design.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1100px] mx-auto px-6">

                {/* OUR STORY */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        <motion.div variants={fadeUp}>
                            <h2 className="text-[28px] font-medium mb-2">
                                Our Story
                            </h2>
                            <div className="w-8 h-[2px] bg-[#ea2e0e] mb-4"></div>

                            <p className="text-[14px] text-gray-600 leading-relaxed">
                                We are more than just a clothing brand. We are a community of fashion enthusiasts dedicated to bringing you the best in contemporary style, quality, and comfort.
                                <br /><br />
                                Founded in 2026, our journey began with a simple observation: modern fashion often forces people to choose between style, quality, and affordability.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="relative group">
                            <img
                                src={storyImage}
                                alt="Our Story"
                                className="w-full h-auto object-cover rounded-sm"
                            />
                            {user?.role === "admin" && (
                                <button
                                    onClick={() => setEditTarget({ field: "aboutUsStoryImage", url: storyImage })}
                                    className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-10"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                            )}
                        </motion.div>

                    </div>
                </section>

                {/* MISSION & VISION */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        <motion.div
                            variants={fadeUp}
                            className="border border-[#E5E5E5] p-6 rounded-sm"
                        >
                            <h2 className="text-[16px] font-medium mb-2">
                                Our Mission
                            </h2>
                            <div className="w-8 h-[2px] bg-[#ea2e0e] mb-4"></div>

                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                To empower individuals to express their unique identity through accessible, high-quality fashion.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="border border-[#E5E5E5] p-6 rounded-sm"
                        >
                            <h2 className="text-[16px] font-medium mb-2">
                                Our Vision
                            </h2>
                            <div className="w-8 h-[2px] bg-[#ea2e0e] mb-4"></div>

                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                To become the global destination for modern fashion, recognized for our commitment to quality and innovation.
                            </p>
                        </motion.div>

                    </div>
                </section>

                {/* BRAND STORY */}
                <section className="py-16 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        <motion.div variants={fadeUp} className="relative group">
                            <img
                                src={brandImage}
                                alt="Brand Story"
                                className="w-full h-auto object-cover rounded-sm"
                            />
                            {user?.role === "admin" && (
                                <button
                                    onClick={() => setEditTarget({ field: "aboutUsBrandImage", url: brandImage })}
                                    className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ea2e0e] hover:text-white z-10"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                            )}
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <h2 className="text-[28px] font-medium mb-2">
                                The Rabbit Edge
                            </h2>
                            <div className="w-8 h-[2px] bg-[#ea2e0e] mb-4"></div>

                            <div className="space-y-4">
                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                    What started as a small capsule collection has grown into a comprehensive wardrobe destination.
                                </p>

                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                    We work directly with skilled artisans and premium manufacturers to bring you high-quality pieces.
                                </p>

                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                    Our design philosophy blends timeless silhouettes with modern detail.
                                </p>

                                <p className="text-[14px] font-medium pt-4">
                                    Thank you for being part of our story.
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </section>

                <AnimatePresence>
                    {editTarget && (
                        <ImageEditModal
                            field={editTarget.field}
                            currentUrl={editTarget.url}
                            onClose={() => setEditTarget(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default About;