import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Layout/Hero"
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrival from "../components/Products/NewArrival";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import { ProductDetailsSkeleton } from "../components/Common/Skeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSellerProduct, setBestSellerProduct] = useState(null)


  useEffect(() => {
    //Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: 8,
      })
    )
    //Fetch Best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error)
      }
    }
    fetchBestSeller()
  }, [dispatch])
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Hero />
      <GenderCollectionSection />
      <NewArrival />

      {/* Best Seller */}
      <h2 className="text-[18px] text-center font-medium mb-4 uppercase tracking-tight">Best Seller</h2>

      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) : (
        <ProductDetailsSkeleton />
      )}

      <div className="container mx-auto">
        <h2 className="text-[18px] text-center font-medium mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </motion.div>
  );
};

export default Home;