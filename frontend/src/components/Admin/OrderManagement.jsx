import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate])

    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }));
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
            <h2 className="text-[28px] font-medium mb-6">Order Management</h2>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-600 hidden md:table">
                    <thead className="bg-gray-100 text-[12px] uppercase text-gray-900 tracking-tight">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Total Price</th>
                            <th className="py-3 px-4">Status</th>
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
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <motion.tr
                                    key={order._id}
                                    className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap text-[14px]">
                                        #{order._id}
                                    </td>
                                    <td className="p-4 text-[14px] text-gray-600">{order.user?.name || "N/A"}</td>
                                    <td className="p-4 text-[14px] text-gray-600">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-[13px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 cursor-pointer"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleStatusChange(order._id, "Delivered")}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-green-600 cursor-pointer"
                                        >
                                            Mark as Delivered
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No Orders found.</td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>

                {/* Mobile View: Cards */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Order ID</span>
                                    <span className="text-[14px] font-medium text-gray-900 break-all ml-2">#{order._id}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Customer</span>
                                    <span className="text-[14px] text-gray-600">{order.user?.name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Total Price</span>
                                    <span className="text-[14px] text-gray-600">${order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Status</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-[13px] rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleStatusChange(order._id, "Delivered")}
                                        className="w-full bg-green-500 text-white py-3 rounded-md text-[13px] font-medium hover:bg-green-600 transition-colors"
                                    >
                                        Mark as Delivered
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                            No Orders found.
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default OrderManagement