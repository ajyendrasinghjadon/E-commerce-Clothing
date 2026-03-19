import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAdminProducts, deleteProduct } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the Product?")) {
      dispatch(deleteProduct(id));
    }
  }

  if (loading) return <p>Loading ...</p>
  if (error) return <p className="text-red-500">{error}</p>

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Link
          to="/admin/products/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          + Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {products.length > 0 ? (products.map((product) => (
              <motion.tr
                key={product._id}
                className="border-b border-gray-200 hover:bg-gray-50"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {product.name}
                </td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 hover:cursor-pointer"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => (handleDelete(product._id))}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 hover:cursor-pointer">
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))
            ) : (<tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No Products found.
              </td>
            </tr>)}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  )
}
export default ProductManagement