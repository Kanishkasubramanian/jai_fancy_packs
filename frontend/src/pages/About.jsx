import React from 'react';
import { Package, Truck, ShieldCheck, Leaf, Users, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-30"
                        src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Warehouse with packaging"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        About Jai Fancy Packs
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                        Coimbatore's premier destination for high-quality packaging materials. We don't just sell boxes; we protect your brand's promise.
                    </p>
                </div>
            </div>

            {/* Our Story */}
            <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Story</h2>
                        <div className="space-y-6 text-lg text-gray-600">
                            <p>
                                Founded in the industrial hub of Coimbatore, Jai Fancy Packs began with a simple mission: to provide durable, aesthetic, and reliable packaging solutions for businesses of all sizes.
                            </p>
                            <p>
                                What started as a small local supplier of tissue products and paper bags has now grown into a comprehensive packaging superstore. We understand that in modern e-commerce and retail, packaging is the first physical touchpoint your customer has with your brand.
                            </p>
                            <p>
                                From customized premium gift bags to heavy-duty corrugated boxes, we treat every order with the utmost care, ensuring your products reach their destination exactly as intended.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0 relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                        <img 
                            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                            alt="Packaging boxes arranged neatly" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
                        <p className="mt-4 text-xl text-gray-600">The pillars that make Jai Fancy Packs stand out.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                            <p className="text-gray-600">We source only the finest materials. Our bags don't tear easily and our boxes don't crush under standard pressure.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly Options</h3>
                            <p className="text-gray-600">We are committed to sustainability, offering a wide range of biodegradable, kraft, and recyclable packaging.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
                            <p className="text-gray-600">Your success is our success. We offer personalized support and bulk pricing tailored to your business needs.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Ready to upgrade your packaging?
                    </h2>
                    <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                        Browse our extensive catalog or get in touch for custom branded packaging solutions.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/products" className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
                            View Products
                        </a>
                        <a href="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
