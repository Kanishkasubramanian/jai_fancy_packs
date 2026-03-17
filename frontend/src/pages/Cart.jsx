import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const updateQty = (item, qty) => {
        addToCart({ ...item, _id: item.product }, Number(qty));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=checkout');
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-2 text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all">
                            Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
                                {cartItems.map((item) => (
                                    <li key={item.product} className="flex py-6 px-4 sm:px-6">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-24 h-24 rounded-md object-center object-cover border border-gray-200"
                                            />
                                        </div>

                                        <div className="ml-4 flex-1 flex flex-col justify-between">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm font-semibold hover:text-blue-600 transition-colors">
                                                            <Link to={`/product/${item.product}`}>
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                                    <div className="flex items-center border border-gray-300 w-max rounded-md bg-white">
                                                        <button 
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                            onClick={() => updateQty(item, item.qty > 1 ? item.qty - 1 : 1)}
                                                            disabled={item.qty <= 1}
                                                        ><Minus className="w-4 h-4"/></button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                                                        <button 
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                            onClick={() => updateQty(item, item.qty < item.countInStock ? item.qty + 1 : item.qty)}
                                                            disabled={item.qty >= item.countInStock}
                                                        ><Plus className="w-4 h-4"/></button>
                                                    </div>

                                                    <div className="absolute top-0 right-0 sm:right-2">
                                                        <button
                                                            onClick={() => removeFromCart(item.product)}
                                                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <span className="sr-only">Remove</span>
                                                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mt-4 flex text-sm text-gray-500 space-x-2">
                                                <span>Subtotal: </span>
                                                <span className="font-medium text-gray-900">₹{item.price * item.qty}</span>
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-16 bg-white rounded-xl shadow-sm px-6 py-8 sm:p-8 lg:mt-0 lg:col-span-4 border border-gray-100">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                            
                            <dl className="space-y-4 text-sm text-gray-600">
                                <div className="flex items-center justify-between">
                                    <dt>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</dt>
                                    <dd className="font-medium text-gray-900">₹{cartTotal}</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <dt className="text-base font-medium text-gray-900">Order Total</dt>
                                    <dd className="text-base font-bold text-gray-900">₹{cartTotal}</dd>
                                </div>
                            </dl>

                            <div className="mt-8">
                                <button
                                    onClick={checkoutHandler}
                                    className="w-full bg-blue-600 border border-transparent rounded-full shadow-sm py-3 px-4 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500 flex justify-center items-center transition-all hover:scale-[1.02]"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                            
                            <div className="mt-6 text-center text-sm text-gray-500">
                                <p>
                                    or{' '}
                                    <Link to="/products" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
                                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
