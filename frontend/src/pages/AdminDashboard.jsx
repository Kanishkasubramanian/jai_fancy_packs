import { useState, useEffect, useContext } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Edit, Trash2, X, Check, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Customers' },
    ];

    return (
        <div className="flex bg-gray-50 min-h-[calc(100vh-64px)]">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 overflow-x-hidden p-8">
                {children}
            </main>
        </div>
    );
};

const DashboardOverview = () => {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prodsRes, ordersRes, usersRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders'),
                    api.get('/auth')
                ]);
                
                const revenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
                
                setStats({
                    products: prodsRes.data.length,
                    orders: ordersRes.data.length,
                    users: usersRes.data.length,
                    revenue
                });
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.revenue}</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><LayoutDashboard size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Products</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.products}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ShoppingBag size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Users size={24} /></div>
                </div>
            </div>
            
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold">Welcome back, Admin</h3>
                <p className="text-gray-500 mt-2">Use the sidebar to manage your store's database, including products and incoming orders.</p>
            </div>
        </div>
    );
};

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                alert("Error deleting product");
            }
        }
    };

    const handleCreate = async () => {
        try {
            const { data } = await api.post('/products');
            await fetchProducts();
            setEditingProduct(data);
        } catch (err) {
            alert("Error creating product template");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editingProduct._id}`, editingProduct);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            alert("Error updating product");
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                <button onClick={handleCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID / Name</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-gray-500 text-xs">{product._id}</div>
                                </td>
                                <td className="px-6 py-4">₹{product.price}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.countInStock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-900 p-1">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0">
                            <h2 className="text-2xl font-bold">Edit Product: {editingProduct.name}</h2>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock Count</label>
                                    <input type="number" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProduct.countInStock} onChange={e => setEditingProduct({...editingProduct, countInStock: Number(e.target.value)})} required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} required rows="3"></textarea>
                            </div>
                            
                            <h3 className="font-semibold pt-6 pb-2 border-t mt-6 text-gray-900">Product Gallery (4 Angles)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {['front', 'back', 'left', 'right'].map((angle) => {
                                    const imgObj = editingProduct.images?.find(img => img.angle === angle) || { angle, url: '' };
                                    return (
                                        <div key={angle} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <label className="block text-sm font-medium mb-2 capitalize text-gray-700">{angle} Image URL</label>
                                            <input 
                                                className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                                value={imgObj.url} 
                                                onChange={e => {
                                                    const newImages = [...(editingProduct.images || [])];
                                                    const idx = newImages.findIndex(img => img.angle === angle);
                                                    if (idx >= 0) newImages[idx].url = e.target.value;
                                                    else newImages.push({ angle, url: e.target.value });
                                                    setEditingProduct({...editingProduct, images: newImages});
                                                }}
                                                placeholder={`URL for ${angle} view`}
                                                required
                                            />
                                            {imgObj.url && (
                                                <div className="mt-2 aspect-video bg-white rounded border border-gray-200 overflow-hidden relative">
                                                    <img src={imgObj.url} className="w-full h-full object-cover" alt={`${angle} preview`} onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=Invalid+URL'; }} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            if (status === 'Delivered') {
                await api.put(`/orders/${id}/deliver`);
            }
            fetchOrders();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading orders...</div>;

    const statusColors = {
        'Order Placed': 'bg-gray-100 text-gray-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Incoming Orders</h1>
            <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID / Date</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs">{order._id}</div>
                                    <div className="text-gray-500 text-xs">{order.createdAt.substring(0,10)}</div>
                                </td>
                                <td className="px-6 py-4">{order.user ? order.user.name : 'Unknown User'}</td>
                                <td className="px-6 py-4 font-medium">₹{order.totalPrice}</td>
                                <td className="px-6 py-4">
                                    {order.isPaid ? (
                                        <Check className="text-green-500 w-5 h-5"/>
                                    ) : (
                                        <X className="text-red-500 w-5 h-5"/>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.orderStatus} 
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded-full font-semibold border-none focus:ring-0 cursor-pointer ${statusColors[order.orderStatus]}`}
                                    >
                                        <option value="Order Placed">Order Placed</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-900 p-1 bg-blue-50 rounded" title="View Details">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CustomerManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/auth');
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Management</h1>
            <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{user._id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    {user.isAdmin ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">User</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/admin-login');
        }
    }, [user, navigate]);

    if (!user || !user.isAdmin) return null;

    return (
        <AdminLayout>
            <Routes>
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="users" element={<CustomerManager />} />
                <Route path="*" element={<DashboardOverview />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminDashboard;
