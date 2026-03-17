import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        address: user?.address?.street || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || '',
        country: user?.address?.country || 'India',
    });

    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // or COD
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=checkout');
        } else if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [user, navigate, cartItems]);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create Order in DB
            const { data: orderData } = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress: address,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            });

            if (paymentMethod === 'COD') {
                clearCart();
                navigate('/profile'); // user can see orders there
                return;
            }

            // Razorpay Flow
            const res = await loadRazorpayScript();
            if (!res) {
                setError('Razorpay SDK failed to load. Check your connection.');
                setLoading(false);
                return;
            }

            const { data: razorpayOrder } = await api.post('/payment/razorpay', {
                amount: totalPrice
            });

            const options = {
                key: 'rzp_test_SSEpgk2gzbDEkl', // Real test key id
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Jai Fancy Packs',
                description: `Payment for Order ${orderData._id}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const { data: verifyData } = await api.post('/payment/razorpay/verify', {
                            orderCreationId: razorpayOrder.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (verifyData.msg === 'success') {
                            await api.put(`/orders/${orderData._id}/pay`, {
                                id: response.razorpay_payment_id,
                                status: 'Success',
                                update_time: new Date().toISOString(),
                                email_address: user.email
                            });
                            clearCart();
                            navigate('/profile');
                        }
                    } catch (err) {
                        setError('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: '9999999999'
                },
                theme: {
                    color: '#2563EB'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred while placing order');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    
                    {/* Left Column - Form */}
                    <div className="lg:col-span-7 space-y-8">
                        {error && (
                            <div className="bg-red-50 p-4 border-l-4 border-red-500 rounded flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}
                        
                        {/* Address Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                                <Truck className="w-6 h-6 text-blue-600" /> Shipping Details
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input type="text" name="address" required value={address.address} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input type="text" name="city" required value={address.city} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input type="text" name="postalCode" required value={address.postalCode} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input type="text" name="country" required value={address.country} onChange={handleAddressChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                                <CreditCard className="w-6 h-6 text-blue-600" /> Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-3 font-medium text-gray-900">Online Payment (Razorpay)</span>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="divide-y divide-gray-200 mb-6 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="py-3 flex justify-between items-center text-sm">
                                        <div className="flex gap-3 items-center">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                <p className="text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                        <div className="font-medium text-gray-900">₹{item.qty * item.price}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items Total</span>
                                    <span className="font-medium">₹{itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="font-medium">₹{shippingPrice}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Order Total</span>
                                    <span className="text-2xl font-black text-blue-600">₹{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="mt-8 w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-[1.02] shadow-md disabled:bg-gray-400 disabled:hover:scale-100 flex justify-center items-center"
                            >
                                {loading && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                )}
                                {paymentMethod === 'Razorpay' ? 'Proceed to Pay' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
