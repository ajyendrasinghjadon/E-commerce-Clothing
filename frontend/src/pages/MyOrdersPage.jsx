import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { TableSkeleton } from "../components/Common/Skeleton";

const MyOrdersPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchUserOrders())
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }

    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return <motion.div
        className="max-w-7xl mx-auto p-4 sm:p-6 "
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
    >
        <h2 className="text-[28px] font-medium mb-6 uppercase tracking-tight">My Orders</h2>
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
            {loading ? (
                <TableSkeleton rows={8} cols={7} />
            ) : (
                <>
                    {/* Desktop View: Table */}
                    <table className="min-w-full text-left text-gray-600 hidden md:table">
                        <thead className="bg-gray-100 text-[12px] uppercase text-gray-900 tracking-tight">
                            <tr>
                                <th className="py-2 px-4 sm:py-3 font-medium">Image</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Order ID</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Created</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Shipping Address</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Items</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Price</th>
                                <th className="py-2 px-4 sm:py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => handleRowClick(order._id)}
                                        className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer transition">
                                        <td className="py-2 px-2 sm:py-4 sm:px-4 flex justify-center">
                                            <img src={order.orderItems?.[0]?.image || "https://via.placeholder.com/150"} alt={order.orderItems?.[0]?.name || "Product"}
                                                className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-lg" />
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                                            #{order._id}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {new Date(order.createdAt).toLocaleDateString()}{" "}
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {order.orderItems.length}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {order.totalPrice.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}

                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            <span className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 "}
                                        px-2 py-1 rounded-full text-[12px] font-medium`}>
                                                {order.isPaid ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                                        You have no orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile View: Cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => handleRowClick(order._id)}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm active:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={order.orderItems?.[0]?.image || "https://via.placeholder.com/150"}
                                                alt={order.orderItems?.[0]?.name || "Product"}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h3 className="text-[14px] font-medium text-gray-900 break-all">
                                                    #{order._id}
                                                </h3>
                                                <p className="text-[12px] text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 "}
                                            px-2 py-1 rounded-full text-[12px] font-medium`}>
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                        <div>
                                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">Shipping</p>
                                            <p className="text-[13px] text-gray-600">
                                                {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">Items</p>
                                            <p className="text-[13px] text-gray-600">{order.orderItems.length} Products</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">Price</p>
                                            <p className="text-[14px] font-medium text-gray-900">
                                                {order.totalPrice.toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
                                You have no orders yet.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    </motion.div>
};

export default MyOrdersPage;