import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const ProductGrid = ({ products, loading, error }) => {
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error: {error}</p>
    }
    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 m-4 sm:m-8 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            }}
        >
            {products.map((product, index) => (
                <motion.div
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                    }}
                >
                    <Link to={`/product/${product._id}`} className="block group">
                        <div className="bg-white p-2 sm:p-4 rounded-lg transform transition-transform duration-300 group-hover:scale-103 group-hover:shadow-md h-full">
                            <div className="w-full h-48 sm:h-96 mb-2 sm:mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={product.images?.[0]?.url}
                                    alt={product.images?.[0]?.altText || product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-xs sm:text-sm mb-1 sm:mb-2 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                            <p className="text-gray-500 font-medium text-xs sm:text-sm tracking-tighter">
                                ${product.price}
                            </p>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default ProductGrid