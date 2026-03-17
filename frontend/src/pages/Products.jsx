import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('');

    const location = useLocation();
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = categoryParam ? `/products?category=${categoryParam}` : '/products';
                const { data } = await api.get(url);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [location]);

    const categories = [
        'all', 'tissue', 'customized bags', 'gift bags', 'paper bags', 
        'plastic covers', 'courier bags', 'wrapping items', 'packaging boxes', 'disposable items'
    ];

    // Filter by search
    let filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by category if manually selected from dropdown (overriding URL)
    if (selectedCategory && selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
        // newest
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                        {selectedCategory && selectedCategory !== 'all' 
                            ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                            : 'All Products'}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Search our catalog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters & Sorting */}
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={selectedCategory || 'all'}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map((c, i) => (
                                        <option key={i} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex-1 md:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
