import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <div className="border-b border-gray-300 overflow-hidden">
            <button
                className="w-full py-5 flex justify-between items-center text-left focus:outline-none px-1 group"
                onClick={toggleOpen}
            >
                <span className="text-[14px] font-medium text-gray-900 group-hover:text-[#ea2e0e] transition-colors">
                    {question}
                </span>

                <span className="ml-4 shrink-0 text-[#ea2e0e]">
                    {isOpen ? (
                        <FiChevronUp className="text-[18px]" />
                    ) : (
                        <FiChevronDown className="text-[18px]" />
                    )}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="pb-5 px-1 text-[13px] text-gray-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What is your return and exchange policy?",
            answer:
                "Return unworn items within 30 days with original tags. You can receive a refund or exchange based on availability."
        },
        {
            question: "How long does shipping take?",
            answer:
                "Standard delivery takes 3–5 business days. Express options (1–2 days) are available at checkout."
        },
        {
            question: "How can I track my order?",
            answer:
                "You’ll receive a tracking link via email once your order ships. You can also check it in your account."
        },
        {
            question: "Do you ship internationally?",
            answer:
                "Yes, we ship to 50+ countries. Delivery times and rates are calculated at checkout."
        },
        {
            question: "How do your clothes fit?",
            answer:
                "Our products fit true to size. Refer to the size chart on each product page for accuracy."
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept major cards, PayPal, Apple Pay, and Google Pay."
        }
    ];

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20 }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 25 },
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
            <div className="container mx-auto px-4 lg:px-8 max-w-3xl">

                {/* HEADER */}
                <motion.div
                    className="text-center mb-14"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                >
                    <h1 className="text-[28px] font-medium mb-3 text-[#ea2e0e]">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-[14px] text-gray-600 max-w-md mx-auto leading-relaxed">
                        Find quick answers about orders, shipping, returns, and more.
                    </p>
                </motion.div>

                {/* FAQ BOX */}
                <motion.div
                    className="bg-white rounded-xl p-6 border border-gray-300"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                >
                    <div className="divide-y divide-gray-300">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                toggleOpen={() =>
                                    setOpenIndex(openIndex === index ? -1 : index)
                                }
                            />
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                >
                    <p className="text-[13px] text-gray-600 mb-3">
                        Still need help?
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-[#ea2e0e] text-white text-[13px] px-8 py-3 rounded-md hover:bg-red-700 transition"
                    >
                        Contact Support
                    </a>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Faqs;