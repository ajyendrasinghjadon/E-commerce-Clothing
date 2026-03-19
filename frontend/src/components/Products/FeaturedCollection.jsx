import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import featured from "../../assets/featured.webp"

const FeaturedCollection = () => {
    return (
        <section className="py-1 px-4 lg:px-0 m-12">
            <div className="container flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl overflow-hidden">
                {/* Left Content */}
                <motion.div
                    className="lg:w-1/2 p-8 text-center lg:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Comfort And Style
                    </h2>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Apparel made for your everyday life
                    </h2>
                    <p className="text-lg text-gray-500 mb-6">
                        Discover high quality, comfortable clothing that effortlessly blends fashion and function. Designed to make you look and feel great every day.
                    </p>
                    <Link to="/collections/all" className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 hover:scale-105 inline-block transition-transform duration-300">
                        Show Now
                    </Link>
                </motion.div>
                {/* Right Content */}
                <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img
                        src={featured}
                        alt="Featured Collection"
                        className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl hover:scale-105 transition-transform duration-700"
                    />
                </motion.div>
            </div>
        </section>
    )
}

export default FeaturedCollection