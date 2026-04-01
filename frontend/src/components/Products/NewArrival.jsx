import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const NewArrival = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([])

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        )
        setNewArrivals(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchNewArrivals()
  }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  }

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? - 300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Update scroll buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const leftScroll = container.scrollLeft;
    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(leftScroll > 0);
    setCanScrollRight(leftScroll < maxScrollLeft - 2);
  };


  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);


  return (
    <section className="py-16 px-4 lg:px-0 mx-4 md:mx-12">
      <div className="container mx-auto text-center mb-10 relative">
        <motion.h2
          className="text-[18px] font-medium mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          Explore New Arrivals
        </motion.h2>
        <motion.p
          className="text-[14px] text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
        </motion.p>
        
        {/* Scroll Buttons - Repositioned for mobile */}
        <div className="absolute right-0 bottom-[-30px] sm:bottom-[-20px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border border-gray-300 transition-colors ${canScrollLeft ? "bg-white text-black hover:bg-gray-100 cursor-pointer" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}>
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border border-gray-300 transition-colors ${canScrollRight ? "bg-white text-black hover:bg-gray-100 cursor-pointer" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}>
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-auto no-scrollbar flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <motion.div
            key={product._id}
            className="min-w-[150px] sm:min-w-[320px] lg:min-w-[350px] shrink-0 relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[250px] sm:h-125 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-2 sm:p-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium text-[14px]">{product.name}</h4>
                <p className="mt-1 text-[13px] text-white/80">${product.price}</p>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default NewArrival