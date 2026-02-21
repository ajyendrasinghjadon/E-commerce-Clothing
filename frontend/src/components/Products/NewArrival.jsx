import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
    const walk = ( x - startX ) * 1.5;
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
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>
        {/* Scroll Buttons */}
        <div className="absolute right-0 -bottom-7.5 flex space-x-2">
          <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-3xl border border-gray-300 ${canScrollLeft ? "bg-white text-black hover:cursor-pointer" : "bg-gray-200 text-gray-400"}`}>
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded-3xl border border-gray-300 ${canScrollRight ? "bg-white text-black hover:cursor-pointer" : "bg-gray-200 text-gray-400"}`}>
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
          <div key={product._id} className="min-w-70 sm:min-w-[320px] lg:min-w-87.5 shrink-0 relative">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-125 object-cover rounded-lg"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrival