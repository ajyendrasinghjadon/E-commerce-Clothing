import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import heroImg from "../../assets/rabbit-hero.webp"
const Hero = () => {
  return (<section className="relative">
    <motion.img
      src={heroImg}
      alt="rabbit"
      className="w-full h-100 md:h-120 lg:h-187.5 object-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
    <div className="absolute bg-black/5 inset-0 flex items-center justify-center">
      <div className="text-center text-white p-6">
        <motion.h1
          className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Vacation <br /> Ready
        </motion.h1>
        <motion.p
          className="text-sm tracking-tighter md:text-lg mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explore our vacation ready outfits with fast worldwide shipping.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/collections/all" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg inline-block hover:scale-105 transition-transform duration-300">
            Shop Now
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
  )
}

export default Hero