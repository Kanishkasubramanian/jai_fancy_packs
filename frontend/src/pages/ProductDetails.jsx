import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, inWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    const frontImg = data.images.find(img => img.angle === 'front');
                    setMainImage(frontImg ? frontImg.url : data.images[0].url);
                }
                
                // Fetch related items by category (AI logic simulation)
                const { data: allProds } = await api.get(`/products?category=${data.category}`);
                setRelatedProducts(allProds.filter(p => p._id !== data._id).slice(0, 4));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching product", error);
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const isLoved = inWishlist(product._id);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 items-start lg:col-span-1">
                        {/* Thumbnails */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto w-full lg:w-24 shrink-0 no-scrollbar">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img.url)}
                                    className={`relative aspect-square rounded-lg overflow-hidden flex-shrink-0 w-20 lg:w-full border-2 transition-all ${mainImage === img.url ? 'border-orange-500 shadow-md ring-2 ring-orange-500 ring-offset-1' : 'border-transparent hover:border-orange-300'}`}
                                >
                                    <img src={img.url} alt={`${product.name} - ${img.angle}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-[10px] text-white text-center py-0.5 capitalize font-medium backdrop-blur-sm">
                                        {img.angle}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Main Image with Zoom effect */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                            <img 
                                src={mainImage} 
                                alt={product.name} 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150 origin-center cursor-zoom-in"
                            />
                            <button 
                                onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors z-10"
                            >
                                <Heart className={`w-6 h-6 ${isLoved ? 'fill-rose-500 text-rose-500' : 'text-gray-600 hover:text-rose-500'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 lg:mt-0 lg:col-span-1 flex flex-col">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center divide-x divide-gray-300">
                                <div className="flex items-center pr-4">
                                    <div className="flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-5 h-5 ${product.rating >= star ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="ml-2 text-sm text-gray-500 font-medium">({product.numReviews} Reviews)</p>
                                </div>
                                <div className="pl-4">
                                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="sr-only">Product description</h2>
                            <p className="text-base text-gray-700 leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-4xl tracking-tight font-black text-gray-900">
                                ₹{product.price}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
                        </div>

                        <div className="py-6 border-t border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold text-gray-900">Quantity</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                    <button 
                                        onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={product.countInStock === 0}
                                    ><Minus className="w-5 h-5" /></button>
                                    <span className="w-12 text-center font-semibold text-lg">{qty}</span>
                                    <button 
                                        onClick={() => setQty(qty < product.countInStock ? qty + 1 : qty)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={product.countInStock === 0}
                                    ><Plus className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className="text-sm font-medium">
                                {product.countInStock > 0 ? (
                                    <span className="text-green-600">In Stock ({product.countInStock} available)</span>
                                ) : (
                                    <span className="text-red-500">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => addToCart(product, qty)}
                                disabled={product.countInStock === 0}
                                className="flex-1 bg-blue-100 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-lg font-bold text-blue-700 shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ShoppingCart className="w-6 h-6 mr-2" />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    addToCart(product, qty);
                                    navigate('/login?redirect=checkout');
                                }}
                                disabled={product.countInStock === 0}
                                className="flex-1 bg-orange-500 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-lg font-bold text-white shadow-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-6 text-sm text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
                                <span>High Quality Materials Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="w-8 h-8 text-blue-500 shrink-0" />
                                <span>Fast Delivery in Coimbatore</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommended Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-16 border-t border-gray-200">
                        <div className="mb-10 flex items-center gap-3 justify-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Customers Also Bought</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod._id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
