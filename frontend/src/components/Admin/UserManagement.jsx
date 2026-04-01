import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/adminSlice";

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate])
    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers())
        }
    }, [dispatch, user])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", //default role    
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,

        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData))
        //reset form after submission
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer"
        })
    }

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }))
    }

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId))
        }
    }

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
            <h2 className="text-[28px] font-medium mb-6">User Management</h2>
            {loading && <p>Loading ...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {/* Add new user form */}
            <div className="p-6 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-[18px] font-medium mb-4">Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[13px] font-medium text-gray-900 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[13px] font-medium text-gray-900 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[13px] font-medium text-gray-900 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[13px] font-medium text-gray-900 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md text-[13px] font-medium hover:bg-green-600 transition-colors">
                        Add User
                    </button>
                </form>
            </div>
            {/* User List Management */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-600 hidden md:table">
                    <thead className="bg-gray-100 text-[12px] uppercase text-gray-900 tracking-tight">
                        <tr>
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">Email</th>
                            <th className="py-3 px-4 font-medium">Role</th>
                            <th className="py-3 px-4 font-medium">Actions</th>
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
                        {users.map((user) => (
                            <motion.tr
                                key={user._id}
                                className="border-b border-gray-300 hover:bg-gray-50"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                 <td className="p-4 font-medium text-gray-900 whitespace-nowrap text-[14px]">
                                    {user.name}
                                </td>
                                <td className="p-4 text-[14px] text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md text-[13px]">
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-red-600 hover:cursor-pointer">Delete</button>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>

                {/* Mobile View: Cards */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {users.map((user) => (
                        <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Name</span>
                                <span className="text-[14px] font-medium text-gray-900 break-all ml-4 text-right">{user.name}</span>
                            </div>
                            <div className="flex flex-col mb-2">
                                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight mb-1">Email</span>
                                <span className="text-[14px] text-gray-600 break-all">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">Role</span>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md text-[13px]">
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                <button 
                                    onClick={() => handleDeleteUser(user._id)} 
                                    className="w-full bg-red-500 text-white py-3 rounded-md text-[13px] font-medium hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default UserManagement