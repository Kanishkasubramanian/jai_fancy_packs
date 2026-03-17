import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const wishlistCount = wishlistItems.length;

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Package className="w-8 h-8 text-blue-600" />
                            <span>Jai Fancy Packs</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-grow items-center justify-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Shop</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About Us</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                    </div>

                    {/* Action Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/wishlist" className="text-gray-600 hover:text-rose-500 transition-colors relative">
                            <Heart className="w-6 h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        
                        <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                                >
                                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                                    <User className="w-5 h-5" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="px-4 py-2 border-b text-sm text-gray-500">
                                            Role: <span className="font-semibold text-gray-800">{user.isAdmin ? 'Admin' : 'Customer'}</span>
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link 
                                            to="/orders" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        {user.isAdmin && (
                                            <Link 
                                                to="/admin/dashboard" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button 
                                            onClick={() => {
                                                handleLogout();
                                                setDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium">
                                <User className="w-5 h-5" />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex flex-row items-center gap-4">
                        <Link to="/cart" className="text-gray-600 relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t pb-4 space-y-1">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
                    <Link to="/products" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">Shop</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">About Us</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">Contact Us</Link>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50">My Profile</Link>
                    
                    {user ? (
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-gray-50">
                            Sign Out
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-blue-600 hover:bg-gray-50">Sign In / Register</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
