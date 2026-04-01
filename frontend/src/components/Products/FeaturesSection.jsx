import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi2"
import { motion } from "framer-motion"

const FeaturesSection = () => {
    return (
        <section className="py-16 px-4 bg-white">
            <motion.div
                className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2 }
                    }
                }}
            >
                {/* Feature 1 */}
                <motion.div
                    className="flex flex-col items-center group hover:scale-105 transition-transform duration-300"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                >
                    <div className="p-4 rounded-full mb-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <HiShoppingBag className="text-xl" />
                    </div>
                    <h4 className="tracking-tight mb-2 font-medium text-[14px] uppercase">
                        FREE INTERNATIONAL SHIPPING
                    </h4>
                    <p className="text-gray-600 text-[13px] tracking-tight">
                        On all orders over $100.00
                    </p>
                </motion.div>
                {/* Feature 2 */}
                <motion.div
                    className="flex flex-col items-center group hover:scale-105 transition-transform duration-300"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                >
                    <div className="p-4 rounded-full mb-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <HiArrowPathRoundedSquare className="text-xl" />
                    </div>
                    <h4 className="tracking-tight mb-2 font-medium text-[14px] uppercase">
                        45 DAYS RETURN
                    </h4>
                    <p className="text-gray-600 text-[13px] tracking-tight">
                        Money back guarantee
                    </p>
                </motion.div>
                {/* Feature 3 */}
                <motion.div
                    className="flex flex-col items-center group hover:scale-105 transition-transform duration-300"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                >
                    <div className="p-4 rounded-full mb-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <HiOutlineCreditCard className="text-xl" />
                    </div>
                    <h4 className="tracking-tight mb-2 font-medium text-[14px] uppercase">
                        SECURE CHECKOUT
                    </h4>
                    <p className="text-gray-600 text-[13px] tracking-tight">
                        100% secure checkout process
                    </p>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default FeaturesSection