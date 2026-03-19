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
                toast.success("Thank you! Your message has been sent successfully. We'll get back to you soon.");
                setFormData({ name: '', email: '', message: '' });
            })
            .catch((err) => {
                toast.error(err.message || "Failed to send message. Please try again later.");
            });
    };

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
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#ea2e0e]">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg hover:text-gray-400 transition-colors">
                        We'd love to hear from you. Please fill out the form below or reach out using the contact details provided.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-lg border border-gray-300"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] text-gray-900 placeholder-gray-400 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] text-gray-900 placeholder-gray-400 transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] text-gray-900 placeholder-gray-400 transition-colors resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ea2e0e] text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 hover:text-gray-300 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionVariants}
                    >
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                            <p className="text-gray-600 mb-8 transition-colors">
                                Our support team is available to assist you during business hours. Feel free to contact us through any of the following channels.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full shrink-0">
                                    <FiMapPin className="text-xl text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Our Location</h3>
                                    <p className="text-gray-600 mt-1 hover:text-gray-400 transition-colors">123 Fashion Street, Suite 456<br />New York, NY 10001</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 w-full py-2"></div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full shrink-0">
                                    <FiPhone className="text-xl text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Phone</h3>
                                    <p className="text-gray-600 mt-1 hover:text-gray-400 transition-colors">+91 98972 - 78469</p>
                                    <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9am-6pm IST</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 w-full py-2"></div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#ea2e0e]/10 p-3 rounded-full shrink-0">
                                    <FiMail className="text-xl text-[#ea2e0e]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Email</h3>
                                    <p className="text-gray-600 mt-1 hover:text-gray-400 transition-colors">ajyendrasinghjadon@gmail.com</p>
                                    <p className="text-gray-500 text-sm mt-1">We'll reply within 24 hours</p>
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
