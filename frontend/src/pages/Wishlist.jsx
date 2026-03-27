import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
    const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
                        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                        <p className="mt-2 text-gray-500 mb-8 max-w-sm mx-auto">Save items you love and buy them later. Explore our premium packaging options!</p>
                        <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-1">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.product} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <Link to={`/product/${item.product}`}>
                                        <img 
                                            src={typeof item.image === 'string' ? item.image : (item.image?.url || 'https://via.placeholder.com/600x600?text=No+Image')} 
                                            alt={item.name}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <button 
                                        onClick={() => toggleWishlist(item)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-rose-500 transition-colors"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-4 flex flex-col grow">
                                    <Link to={`/product/${item.product}`}>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                                        <button 
                                            onClick={() => {
                                                addToCart(item, 1);
                                                // toggleWishlist(item); // optional: remove after add to cart
                                            }}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center group-hover:px-4 duration-300"
                                            title="Add to cart"
                                        >
                                            <ShoppingCart className="w-5 h-5 group-hover:mr-2 transition-all" />
                                            <span className="opacity-0 w-0 hidden group-hover:inline-block group-hover:opacity-100 group-hover:w-auto overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300">
                                                Add to Cart
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
