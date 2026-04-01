import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { motion } from "framer-motion";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.adminProducts);
    const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

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
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {productsLoading || ordersLoading ? (
                <p>Loading ...</p>
            ) : productsError ? (
                <p className="text-red-500">Error fetching products: {productsError}</p>
            ) : ordersError ? (
                <p className="text-red-500">Error fetching orders: {ordersError}</p>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    <motion.div
                        className="p-4 shadow-md rounded-lg bg-white transform transition-transform duration-300 hover:scale-105"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                    >
                        <h2 className="text-xl font-semibold">Revenue</h2>
                        <p className="text-2xl">${totalSales.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        className="p-4 shadow-md rounded-lg bg-white transform transition-transform duration-300 hover:scale-105"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                    >
                        <h2 className="text-xl font-semibold">Total Orders</h2>
                        <p className="text-2xl">{totalOrders}</p>
                        <Link to="/admin/orders" className="text-blue-500 hover:underline">
                            Manage Orders
                        </Link>
                    </motion.div>
                    <motion.div
                        className="p-4 shadow-md rounded-lg bg-white transform transition-transform duration-300 hover:scale-105"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                        }}
                    >
                        <h2 className="text-xl font-semibold">Products</h2>
                        <p className="text-2xl">{products.length}</p>
                        <Link to="/admin/products" className="text-blue-500 hover:underline">
                            Manage Products
                        </Link>
                    </motion.div>
                </motion.div>
            )}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-500 hidden md:table">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Total Price</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" >
                                        <td className="p-4">#{order._id}</td>
                                        <td className="p-4">{order.user?.name || "Deleted User"}</td>
                                        <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4">{order.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile View: Cards */}
                    <div className="md:hidden flex flex-col gap-4">
                         {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Order ID</span>
                                            <span className="text-[14px] font-medium text-gray-900 break-all ml-2">#{order._id}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">User</span>
                                            <span className="text-[14px] text-gray-600">{order.user?.name || "Deleted User"}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Total Price</span>
                                            <span className="text-[14px] text-gray-600">${order.totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Status</span>
                                            <span className="text-[13px] font-medium text-gray-900">{order.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                                    No recent orders found.
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminHomePage