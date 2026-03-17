import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                            Jai Fancy Packs
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">
                            Premium packaging solutions in Coimbatore. We deliver high-quality tissues, customized bags, wrapping materials, and more for all your commercial and personal needs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="hover:text-white transition-colors duration-200">All Products</Link></li>
                            <li><Link to="/products?category=customized bags" className="hover:text-white transition-colors duration-200">Customized Bags</Link></li>
                            <li><Link to="/products?category=tissue" className="hover:text-white transition-colors duration-200">Tissues</Link></li>
                            <li><Link to="/products?category=packaging boxes" className="hover:text-white transition-colors duration-200">Packaging Boxes</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors duration-200">Shipping Info</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-2">📍</span>
                                <div>123 Packaging Street, RS Puram, Coimbatore, Tamil Nadu, India</div>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span>
                                +91 98765 43210
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✉️</span>
                                info@jaifancypacks.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Jai Fancy Packs. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0">
                        <span className="text-sm text-gray-500">
                            Designed with modern <Link to="/admin-login" className="hover:text-white underline">Admin access</Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
