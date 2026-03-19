import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-gray-300 overflow-hidden">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea2e0e] rounded-sm px-2 group"
                onClick={toggleOpen}
            >
                <span className="text-lg font-medium text-gray-900 group-hover:text-[#ea2e0e] transition-colors">{question}</span>
                <span className="ml-4 shrink-0 transition-transform duration-300 text-[#ea2e0e]">
                    {isOpen ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="pb-6 px-2 text-gray-600 leading-relaxed hover:text-gray-300 transition-colors">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(0); // First item open by default

    const faqs = [
        {
            question: "What is your return and exchange policy?",
            answer: "We offer a 30-day return window for unworn items with original tags attached. You can choose to receive a full refund to your original payment method or opt for store credit. Exchanges for different sizes or colors are also accepted depending on inventory availability."
        },
        {
            question: "How long will it take to receive my order?",
            answer: "Standard shipping typically takes 3-5 business days within the continental US. We also offer expedited shipping options (1-2 business days) at checkout. International shipping times vary by location, usually ranging from 7-14 business days. You will receive a tracking number as soon as your order ships."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is processed and shipped, you will receive an email containing a tracking number and a link to trace your package's journey. You can also log into your account on our website and view the live status of your order in the 'My Orders' section."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and estimated delivery times are calculated at checkout based on your location. Please note that international customers are responsible for any customs duties or taxes applied by their local government."
        },
        {
            question: "How do your clothes fit?",
            answer: "Our clothing generally runs true to size. However, we recommend checking the detailed sizing chart available on each product page, as fits may vary depending on the specific style and fabric. Some items are designed for a relaxed fit, while others are more tailored."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. We also offer installment payment options through partner services for eligible orders."
        }
    ];

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
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#ea2e0e]">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600 hover:text-gray-300 transition-colors">
                        Find answers to common questions about our products, shipping, returns, and more.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-2xl p-6 md:p-10 border border-gray-300 shadow-xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                >
                    <div className="divide-y divide-gray-300">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                toggleOpen={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="mt-16 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                >
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-block bg-[#ea2e0e] text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 hover:text-gray-300 transition-colors shadow-lg"
                    >
                        Contact Customer Support
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Faqs;
