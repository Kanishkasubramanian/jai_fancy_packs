import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Package, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-blue-600 p-8 flex items-center gap-6">
                        <div className="bg-white p-4 rounded-full text-blue-600">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
                            <p className="text-blue-100 mt-1">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <Package className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                </div>

                {loading ? (
                    <div className="flex w-full justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-gray-100">
                        <p className="text-gray-500 font-medium">No orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="border-b border-gray-200 bg-gray-50 p-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="flex gap-8 text-sm text-gray-500">
                                        <div>
                                            <span className="font-semibold block text-gray-900">Order Placed</span>
                                            {order.createdAt.substring(0, 10)}
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-900">Total</span>
                                            ₹{order.totalPrice}
                                        </div>
                                        <div className="hidden sm:block">
                                            <span className="font-semibold block text-gray-900">Order ID</span>
                                            {order._id}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-sm font-semibold">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle className={`w-4 h-4 ${order.isPaid ? 'text-green-500' : 'text-orange-500'}`} />
                                            {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className={`w-4 h-4 ${order.isDelivered ? 'text-green-500' : 'text-blue-500'}`} />
                                            {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : `Status: ${order.orderStatus}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:px-6 divide-y divide-gray-100">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="py-3 flex gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-gray-500 text-sm">Qty: {item.qty} | ₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
