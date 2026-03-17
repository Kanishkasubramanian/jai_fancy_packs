import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PackageOpen, Tag, Truck } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                
                // Group products by category to ensure we pick distinct items for the homepage
                const categoryGroups = {};
                data.forEach(product => {
                    if (!categoryGroups[product.category]) {
                        categoryGroups[product.category] = [];
                    }
                    categoryGroups[product.category].push(product);
                });

                const diverseProducts = [];
                const categories = Object.keys(categoryGroups);
                
                // Pick one product from each category to ensure variety, then loop if more needed
                for (let i = 0; diverseProducts.length < 8; i++) {
                    const cat = categories[i % categories.length];
                    if (categoryGroups[cat] && categoryGroups[cat].length > 0) {
                        diverseProducts.push(categoryGroups[cat].shift()); // Take one product from this category
                    } else if (categories.every(c => categoryGroups[c].length === 0)) {
                        break; // All categories empty
                    }
                }

                setFeatured(diverseProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: 'Tissue Products', img: '/images/categories/homepage_tissue_category_1773391254413.png', link: '/products?category=tissue' },
        { name: 'Customized Bags', img: '/images/categories/homepage_custom_bags_category_1773391273319.png', link: '/products?category=customized bags' },
        { name: 'Gift Bags', img: '/images/categories/homepage_gift_bags_category_1773391292357.png', link: '/products?category=gift bags' },
        { name: 'Packaging Boxes', img: '/images/categories/homepage_boxes_category_1773391388320.png', link: '/products?category=packaging boxes' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-[#232F3E] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        src="/images/categories/homepage_hero_banner_1773391404148.png"
                        alt="Premium Packaging Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#232F3E] to-[#232F3E]/60" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl leading-tight">
                        Premium Packaging Solutions for Your Brand
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-xl">
                        Discover top-quality tissue products, customized bags, and premium packaging boxes tailored for businesses in Coimbatore and beyond.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-[#232F3E] bg-[#FF9900] hover:bg-[#FFB84D] shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                            Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Banner */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-4 flex flex-col items-center group">
                            <Truck className="w-10 h-10 text-[#FF9900] mb-3 group-hover:-translate-y-1 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg">Fast Delivery</h3>
                            <p className="text-gray-500 text-sm mt-1">Quick shipping across Coimbatore</p>
                        </div>
                        <div className="p-4 flex flex-col items-center group">
                            <Tag className="w-10 h-10 text-[#FF9900] mb-3 group-hover:-translate-y-1 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg">Wholesale Prices</h3>
                            <p className="text-gray-500 text-sm mt-1">Best rates for bulk commercial orders</p>
                        </div>
                        <div className="p-4 flex flex-col items-center group">
                            <PackageOpen className="w-10 h-10 text-[#FF9900] mb-3 group-hover:-translate-y-1 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg">Custom Designs</h3>
                            <p className="text-gray-500 text-sm mt-1">Personalized brand packaging solutions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop by Category */}
            <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
                        <p className="mt-1 text-base text-gray-500">Find exactly what you are looking for.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={cat.link} className="group relative bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                            </div>
                            <div className="p-6 bg-white relative">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                                <div className="inline-flex items-center text-sm font-semibold text-[#007185] group-hover:text-[#C7511F] transition-colors">
                                    Shop now <ArrowRight className="ml-1 w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white border-t border-gray-200">
                <div className="max-w-[1400px] mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trending Items</h2>
                            <p className="mt-2 text-lg text-gray-500">Top picks for your packaging needs.</p>
                        </div>
                        <Link to="/products" className="hidden sm:inline-flex text-[#007185] hover:text-[#C7511F] font-semibold items-center transition-colors">
                            Explore All Products <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featured.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Recommendation Simulation Section */}
            {!loading && featured.length > 4 && (
                <div className="bg-gradient-to-b from-[#F2FAFA] to-white border-t border-[#E7F4F5]">
                    <div className="max-w-[1400px] mx-auto py-16 px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="bg-[#007185] text-white p-2.5 rounded-lg shadow-sm">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recommended For You</h2>
                                <p className="mt-1 text-base text-gray-500">Based on popular commercial choices.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featured.slice(4, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
