import { useEffect, useState } from "react";
import { FiTrash2, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [
      { url: "https://picsum.photos/150?random=1" },
      { url: "https://picsum.photos/150?random=2" },
    ],
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // Set product data when loaded
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        images:
          selectedProduct.images?.length > 0
            ? selectedProduct.images
            : [
                { url: "https://picsum.photos/150?random=1" },
                { url: "https://picsum.photos/150?random=2" },
              ],
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ IMAGE UPLOAD HANDLER
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 1️⃣ Instant preview
    const previewImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      altText: "",
      isNew: true,
    }));

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...previewImages],
    }));

    // 2️⃣ Upload in background
    try {
      setUploading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Replace first blob preview with real image URL
        setProductData((prev) => ({
          ...prev,
          images: prev.images.map((img) =>
            img.url.startsWith("blob:")
              ? { url: data.imageUrl }
              : img
          ),
        }));
      }

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-3">Upload Images</label>

          <label className="flex flex-col items-center justify-center w-full h-44 
            border-2 border-dashed border-gray-300 
            rounded-xl cursor-pointer 
            bg-gray-50 hover:bg-green-50 
            hover:border-green-500 transition-all duration-200">

            <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />

            <p className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>

            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG (Max 5MB)
            </p>

            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {uploading && (
            <p className="text-sm text-green-600 mt-2">
              Uploading image...
            </p>
          )}

          {/* Image Preview Section */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group"
              >
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-full object-cover"
                />

                {/* Prevent deleting first 2 default images */}
                {index >= 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages =
                        productData.images.filter(
                          (_, i) => i !== index
                        );
                      setProductData({
                        ...productData,
                        images: updatedImages,
                      });
                    }}
                    className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-md 
                    opacity-0 group-hover:opacity-100 transition 
                    hover:bg-red-500 hover:text-white"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;