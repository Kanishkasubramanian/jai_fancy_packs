import React from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Contact Us</h1>
                    <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
                        We're here to help! Whether you have questions about our packaging solutions or need a custom quote, reach out to our team in Coimbatore.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Send className="w-6 h-6 text-blue-600" /> Send us a message
                        </h2>
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" id="lastName" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" required />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" id="phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" />
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                <textarea id="message" rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow" required placeholder="How can we help you?"></textarea>
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 border border-transparent rounded-lg shadow-sm py-4 px-4 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:translate-y-[-1px]">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
                            <p className="text-gray-600 mb-8">
                                As Coimbatore's leading premium packaging provider, we pride ourselves on excellent customer service. Drop by our office or give us a call.
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <p className="font-semibold text-gray-900">Head Office</p>
                                    <p className="mt-1">123 Industrial Estate Road</p>
                                    <p>Peelamedu, Coimbatore</p>
                                    <p>Tamil Nadu, India 641004</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Phone className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <p className="font-semibold text-gray-900">Phone</p>
                                    <p className="mt-1">+91 98765 43210</p>
                                    <p>+91 422 1234567</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Mail className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <p className="font-semibold text-gray-900">Email</p>
                                    <p className="mt-1">info@jaifancypacks.com</p>
                                    <p>sales@jaifancypacks.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div className="ml-4 text-base text-gray-600">
                                    <p className="font-semibold text-gray-900">Working Hours</p>
                                    <p className="mt-1">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Coimbatore Map Location" />
                            <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-gray-900 flex items-center gap-2 shadow-sm">
                                    <Globe className="w-4 h-4 text-blue-600" /> View on Google Maps
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
