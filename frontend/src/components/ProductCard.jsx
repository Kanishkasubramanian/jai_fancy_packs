import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, inWishlist } = useContext(WishlistContext);

    const isLoved = inWishlist(product._id);

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Link to={`/product/${product._id}`}>
                    <img 
                        src={product.images?.find(img => img.angle === 'front')?.url || product.images?.[0]?.url || 'https://via.placeholder.com/600x600?text=No+Image'} 
                        alt={product.name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                
                {/* Wishlist Button */}
                <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                >
                    <Heart className={`w-5 h-5 ${isLoved ? 'fill-rose-500 text-rose-500' : 'text-gray-600 hover:text-rose-500'}`} />
                </button>

                {/* Stock Badge */}
                {product.countInStock === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-1 text-xs text-blue-600 font-semibold uppercase tracking-wider">
                    {product.category}
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center mb-3 mt-auto">
                    <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                className={`w-4 h-4 ${product.rating >= star ? 'fill-current' : 'text-gray-300'}`} 
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.numReviews})</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <button 
                        onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                        disabled={product.countInStock === 0}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
