import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { ProductDetailsSkeleton } from "../Common/Skeleton";


const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    )
    const { user, guestId } = useSelector((state) => state.auth)
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select size and color before adding to cart.", {
                duration: 1000,
            });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                size: selectedSize,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Product added to cart!", {
                    duration: 1000,
                })
            })
            .finally(() => {
                setIsButtonDisabled(false);
            })
    };

    if (loading) {
        return <ProductDetailsSkeleton />
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">Error: {error}</div>
    }

    return (
        <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Thumbnails */}
                        <div className="hidden md:flex flex-col space-y-3 mr-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-[#E5E5E5]"}`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="md:w-1/2">
                            <div className="mb-4">
                                <img
                                    src={mainImage}
                                    alt={selectedProduct.name}
                                    className="w-full h-auto object-cover rounded-lg shadow-sm"
                                />
                            </div>
                        </div>
                        {/* Mobile Thumbnail */}
                        <div className="md:hidden flex overflow-x-auto space-x-3 mb-6">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-[#E5E5E5]"}`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="md:w-1/2 md:ml-6 flex flex-col space-y-6">
                            <div>
                                <h1 className="text-[28px] font-medium text-gray-900 mb-2 uppercase tracking-tight">
                                    {selectedProduct.name}
                                </h1>

                                <div className="flex items-center space-x-2 text-[18px]">
                                    {selectedProduct.originalPrice && (
                                        <span className="text-gray-500 line-through font-normal">
                                            ${selectedProduct.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-gray-900 font-medium">
                                        ${selectedProduct.price}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[14px] text-gray-600 leading-relaxed">
                                {selectedProduct.description}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[13px] font-medium text-gray-900">Color:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.colors?.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border cursor-pointer ${selectedColor === color ? "border-2 border-black" : "border-[#E5E5E5]"}`}
                                                style={{
                                                    backgroundColor: color.toLocaleLowerCase(),
                                                    filter: "brightness(0.9)"
                                                }}></button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[13px] font-medium text-gray-900">Size:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.sizes?.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border border-[#E5E5E5] rounded text-[13px] cursor-pointer ${selectedSize === size ? "bg-black text-white" : "hover:bg-gray-50"}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[13px] font-medium text-gray-900">Quantity:</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <button onClick={() => handleQuantityChange("minus")} className="px-3 py-1 bg-gray-100 rounded text-[13px] hover:cursor-pointer transition">
                                            -
                                        </button>
                                        <span className="text-[13px] font-medium">{quantity}</span>
                                        <button onClick={() => handleQuantityChange("plus")} className="px-3 py-1 bg-gray-100 rounded text-[13px] hover:cursor-pointer transition">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isButtonDisabled}
                                    className={`bg-[#000] text-white py-3 px-5 rounded w-full text-[13px] font-medium transition-all ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:opacity-85 cursor-pointer"}`}>
                                    {isButtonDisabled ? "ADDING TO CART..." : "ADD TO CART"}
                                </button>
                            </div>

                            <div className="pt-6 border-t border-[#E5E5E5] flex flex-col space-y-4">
                                <h3 className="text-[13px] font-medium text-gray-900">Characteristics:</h3>
                                <div className="space-y-2">
                                    {selectedProduct.brand && (
                                        <p className="text-[13px] text-gray-600">
                                            <span className="font-medium text-gray-900">Brand:</span> {selectedProduct.brand}
                                        </p>
                                    )}
                                    {selectedProduct.material && (
                                        <p className="text-[13px] text-gray-600">
                                            <span className="font-medium text-gray-900">Material:</span> {selectedProduct.material}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        className="mt-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-[18px] text-center font-medium mb-4">
                            You May Also Like
                        </h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductDetails;