import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom"
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { OrderDetailsSkeleton } from "../components/Common/Skeleton";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderDetails(id))
    }, [dispatch, id]);

    if (loading) return <OrderDetailsSkeleton />
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>


    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto p-4 sm:p-6"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <h2 className="text-[28px] font-medium mb-6">Order Details</h2>
            {!orderDetails ?
                (<p>No Order details found</p>)
                :
                (
                    <div className="p-4 sm:p-6 rounded-lg border border-gray-200">
                        {/* Order Info */}
                        <div className="flex flex-col sm:flex-row justify-between mb-8">
                            <div>
                                <h3 className="text-[18px] font-medium text-gray-900">
                                    Order ID: #{orderDetails._id}
                                </h3>
                                <p className="text-[14px] text-gray-600">
                                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                                 <span
                                    className={`${orderDetails.isPaid
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        } px-3 py-1 rounded-full text-[12px] font-medium mb-2`}
                                >
                                    {orderDetails.isPaid ? "Approved" : "Pending"}
                                </span>
                                <span
                                    className={`${orderDetails.isDelivered
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        } px-3 py-1 rounded-full text-[12px] font-medium mb-2`}
                                >
                                    {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                                </span>
                            </div>
                        </div>
                        {/* Customer, Payment, Shipping Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h4 className="text-[16px] font-medium mb-2 text-gray-900">Payment Info</h4>
                                <p>Payment Method: {orderDetails.paymentMethod}</p>
                                <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                            </div>

                            <div>
                                <h4 className="text-[16px] font-medium mb-2 text-gray-900">Shipping Info</h4>
                                <p>Shipping Method: {orderDetails.shippingMethod}</p>
                                <p>
                                    Address:{" "}
                                    {orderDetails.shippingAddress
                                        ? `${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                        {/* Product list */}
                        <div className="overflow-x-auto">
                            <h4 className="text-[16px] font-medium mb-4 text-gray-900 border-b pb-2">Products Ordered</h4>
                            <table className="min-w-full text-gray-600 mb-4 table-auto sm:table-fixed">
                                <thead className="bg-gray-50 text-[12px] uppercase text-gray-900 tracking-tight">
                                    <tr>
                                        <th className="py-3 px-4 text-left font-medium">Product</th>
                                        <th className="py-3 px-4 text-left font-medium">Unit Price</th>
                                        <th className="py-3 px-4 text-left font-medium">Qty</th>
                                        <th className="py-3 px-4 text-left font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orderDetails.orderItems || []).map((item) => (
                                        <tr key={item.productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 flex items-center min-w-[250px]">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl mr-4 shadow-sm"
                                                />
                                                <Link
                                                    to={`/product/${item.productId}`}
                                                    className="text-gray-900 font-medium hover:text-black transition-colors break-words"
                                                >
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-gray-900 text-[14px]">${item.price.toFixed(2)}</td>
                                            <td className="py-4 px-4 text-gray-600 text-[14px]">{item.quantity}</td>
                                            <td className="py-4 px-4 font-medium text-gray-900 text-[14px]">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Back to Orders Link */}
                        <Link to="/my-orders" className="text-blue-500 hover:underline">
                            Back to My Orders</Link>
                    </div>
                )}
        </motion.div>
    );
}

export default OrderDetailsPage;