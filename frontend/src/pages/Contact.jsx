import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { contactSupport } from '../redux/slices/authSlice';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(contactSupport(formData))
            .unwrap()
            .then(() => {
                toast.success("Thank you! Your message has been sent successfully.");
                setFormData({ name: '', email: '', message: '' });
            })
            .catch((err) => {
                toast.error(err.message || "Failed to send message.");
            });
    };

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
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

                {/* HEADER */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h1 className="text-[28px] font-medium mb-3 text-[#ea2e0e]">
                        Contact Us
                    </h1>
                    <p className="text-[14px] text-gray-600 max-w-xl mx-auto leading-relaxed">
                        We'd love to hear from you. Please fill out the form below or reach out using the contact details provided.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* FORM */}
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-lg border border-gray-300"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-[18px] font-medium mb-5">
                            Send us a message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-[13px] mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ea2e0e]"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ea2e0e]"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] mb-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ea2e0e] resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ea2e0e] text-white text-[13px] py-2.5 rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>

                    {/* CONTACT INFO */}
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <div>
                            <h2 className="text-[18px] font-medium mb-4">
                                Contact Information
                            </h2>
                            <p className="text-[14px] text-gray-600 mb-6 leading-relaxed">
                                Our support team is available during business hours.
                            </p>
                        </div>

                        <div className="space-y-5 text-[14px]">

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full">
                                    <FiMapPin className="text-[16px] text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-medium">Location</h3>
                                    <p className="text-gray-600 mt-1">123 Fashion Street, New York</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-300"></div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full">
                                    <FiPhone className="text-[16px] text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-medium">Phone</h3>
                                    <p className="text-gray-600 mt-1">+91 98972 - 78469</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-300"></div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full">
                                    <FiMail className="text-[16px] text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-medium">Email</h3>
                                    <p className="text-gray-600 mt-1">ajyendrasinghjadon@gmail.com</p>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default Contact;