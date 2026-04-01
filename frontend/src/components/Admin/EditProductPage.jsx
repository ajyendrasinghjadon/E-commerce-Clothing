import { useEffect, useState } from "react";
import { FiTrash2, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct, createProduct } from "../../redux/slices/adminProductSlice";

const categories = [
  "Shoes",
  "Clothing",
  "Accessories",
  "Bags",
  "Hoodies",
  "T-Shirts"
];

const collectionsList = [
  "Summer",
  "Winter",
  "Streetwear",
  "Best Sellers",
  "New Arrivals"
];

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

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
    images: [],
  });

  const [colorsInput, setColorsInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    } else {
      resetProductData();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedProduct) {
      setProductData({
        ...selectedProduct,
        images: selectedProduct.images?.length
          ? selectedProduct.images.map((img) => ({
            url: img.url,
            altText: img.altText || "",
          }))
          : [],
      });
      if (selectedProduct.colors) {
        setColorsInput(selectedProduct.colors.join(", "));
      }
    }
  }, [id, selectedProduct]);

  const resetProductData = () => {
    setProductData({
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
      images: [],
    });
    setColorsInput("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      altText: "",
    }));

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const colorsArray = colorsInput
      .split(",")
      .map((color) => color.trim())
      .filter((color) => color !== "");

    if (!productData.sizes.length || colorsArray.length === 0) {
      alert("Please select at least one size and color.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("countInStock", productData.countInStock);
    formData.append("sku", productData.sku);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    formData.append("sizes", productData.sizes.join(","));
    formData.append("colors", colorsArray.join(","));
    formData.append("collections", productData.collections);
    formData.append("material", productData.material);
    formData.append("gender",
      productData.gender === "men" ? "Men" :
        productData.gender === "women" ? "Women" : "Unisex"
    );

    // Filter existing images and new files
    const existingImages = productData.images
      .filter(img => !img.file)
      .map(img => ({ url: img.url, altText: img.altText }));

    formData.append("images", JSON.stringify(existingImages));

    productData.images.forEach(img => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });

    if (id) {
      dispatch(updateProduct({ id, productData: formData }))
        .unwrap()
        .then(() => navigate("/admin/products"));
    } else {
      dispatch(createProduct(formData))
        .unwrap()
        .then(() => navigate("/admin/products"));
    }
  };

  if (id && loading) return <p>Loading...</p>;
  if (id && error) return <p className="text-red-500">{error}</p>;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 shadow-md rounded-md"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-900 mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-900 mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-900 mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
            required
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-900 mb-2">Sizes</label>

          <div className="flex gap-3 flex-wrap">
            {sizeOptions.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => {
                  const updatedSizes = productData.sizes.includes(size)
                    ? productData.sizes.filter((s) => s !== size)
                    : [...productData.sizes, size];

                  setProductData({ ...productData, sizes: updatedSizes });
                }}
                className={`px-5 py-3 border rounded-md transition text-[13px] font-medium
        ${productData.sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-900 mb-2">Colors (CSV)</label>
          <input
            type="text"
            placeholder="e.g. Red, Blue, Black"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
          />
          <p className="text-[12px] text-gray-500 mt-1">
            Enter colors separated by commas
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {colorsInput.split(",").map((color, i) => (
              color.trim() && (
                <span key={i} className="px-3 py-1 bg-gray-100 text-[12px] rounded border border-gray-200 text-gray-600">
                  {color.trim()}
                </span>
              )
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* CATEGORY AUTOCOMPLETE */}
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">Category</label>
            <input
              list="category-options"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
              required
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {/* COLLECTION AUTOCOMPLETE */}
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">Collection</label>
            <input
              list="collection-options"
              name="collections"
              value={productData.collections}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 text-[14px] focus:ring-1 focus:ring-gray-900 outline-none"
              required
            />
            <datalist id="collection-options">
              {collectionsList.map((col) => (
                <option key={col} value={col} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[13px] font-medium text-gray-900 mb-3">Gender</label>
          <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
            {["men", "women", "unisex"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setProductData({ ...productData, gender: g })}
                className={`px-6 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200 capitalize
                  ${productData.gender === g 
                    ? "bg-[#ea2e0e] text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-3">Upload Images</label>

          <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-500 transition-all duration-200">
            <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">Click to upload</span>
            </p>
            <input type="file" multiple onChange={handleImageUpload} className="hidden" />
          </label>

          {uploading && <p className="text-sm text-green-600 mt-2">Uploading image...</p>}

          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((image, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group">
                <img src={image.url} alt="Product" className="w-full h-full object-cover" />

                <button
                  type="button"
                  onClick={() => {
                    const updatedImages = productData.images.filter((_, i) => i !== index);
                    setProductData({ ...productData, images: updatedImages });
                  }}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-medium text-[14px]"
        >
          {id ? "Update Product" : "Create Product"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditProductPage;