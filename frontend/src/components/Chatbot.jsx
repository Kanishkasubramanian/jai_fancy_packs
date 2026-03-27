import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const responses = {
    'hello': 'Hello! Welcome to Jai Fancy Packs. How can I help you package today?',
    'hi': 'Hi there! Looking for specific packaging solutions?',
    'products': 'We offer tissues, customized bags, gift bags, paper bags, plastic covers, courier bags, wrapping items, and packaging boxes.',
    'custom': 'Yes, we specialize in customized bags! Please contact our sales team at info@jaifancypacks.com for bulk customized orders.',
    'shipping': 'We deliver all over Coimbatore usually within 24 hours. Extra charges may apply for regions outside city limits.',
    'payment': 'We accept Cash on Delivery (COD) and Online Payments securely via Razorpay.',
    'bulk': 'For wholesale and bulk inquiries, we offer special pricing. Please contact us directly.',
    'about': 'Jai Fancy Packs is a packaging solutions store offering a wide range of tissues, bags, wrapping items, and packaging boxes. We focus on quality materials, reliable delivery around Coimbatore, and friendly service for both retail and bulk customers.',
    'default': 'I am still learning! For specific inquiries, you can call us or leave a message through the Contact Us page.'
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const pendingReplyRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        return () => {
            if (pendingReplyRef.current) {
                clearTimeout(pendingReplyRef.current);
            }
        };
    }, []);

    const normalize = (text) =>
        text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

    const getBotReply = (userText) => {
        const t = normalize(userText);
        if (!t) return responses.default;

        const quickMatches = [
            { keys: ['hello', 'hey', 'hi'], reply: responses.hello },
            { keys: ['products', 'catalog', 'items', 'available'], reply: responses.products },
            { keys: ['custom', 'customized', 'print', 'logo'], reply: responses.custom },
            { keys: ['ship', 'shipping', 'deliver', 'delivery'], reply: responses.shipping },
            { keys: ['pay', 'payment', 'razorpay', 'cod', 'cash'], reply: responses.payment },
            { keys: ['bulk', 'wholesale', 'quantity', 'pricing'], reply: responses.bulk },
            { keys: ['about you', 'about your company', 'about company', 'who are you', 'about jai fancy packs'], reply: responses.about },
            { keys: ['contact', 'phone', 'call', 'email', 'support'], reply: 'You can reach us via the Contact page or email us at info@jaifancypacks.com.' },
        ];

        for (const group of quickMatches) {
            if (group.keys.some((k) => t.includes(k))) return group.reply;
        }

        if (t.includes('price') || t.includes('cost')) {
            return 'Prices vary by product and quantity. Open a product to see the price, or tell me the category and quantity you need.';
        }

        if (t.includes('review') || t.includes('rating')) {
            return 'You can now leave a rating and comment on the product details page. Open a product and scroll to the Reviews section.';
        }

        const asksHowMade =
            t.includes('made') ||
            t.includes('material') ||
            t.includes('materials') ||
            t.includes('how is') ||
            t.includes('how it is') ||
            t.includes('how does') ||
            t.includes('what is it made');

        if (asksHowMade) {
            if (t.includes('tissue')) {
                return 'Tissue is typically made from soft, absorbent paper materials (usually wood pulp or recycled paper) that are processed to be thin, gentle, and highly absorbent.';
            }
            if (t.includes('paper bag') || t.includes('paper bags')) {
                return 'Paper bags are usually made from kraft paper, a strong paper material produced from wood pulp, sometimes with recycled paper content for eco-friendly options.';
            }
            if (t.includes('plastic cover') || t.includes('plastic covers')) {
                return 'Plastic covers are generally made from plastic films like polyethylene (PE) or polypropylene (PP), which provide flexibility, water resistance, and durability.';
            }
            if (t.includes('gift bag') || t.includes('gift bags')) {
                return 'Gift bags are usually made from coated or laminated paper, sometimes combined with decorative finishes, ribbons, and reinforced handles.';
            }
            if (t.includes('customized bag') || t.includes('customized bags')) {
                return 'Customized bags can be made from paper, plastic, or non-woven fabric materials, depending on the design, printing needs, and strength required.';
            }
            if (t.includes('courier bag') || t.includes('courier bags')) {
                return 'Courier bags are typically made from durable plastic materials like LDPE or HDPE, often with tamper-evident adhesive strips and opaque layers for privacy.';
            }
            if (t.includes('wrapping') || t.includes('wrapping item') || t.includes('wrapping items')) {
                return 'Wrapping items are made from materials like wrapping paper, tissue paper, cellophane, or foil, designed to be decorative while still protecting the product.';
            }
            if (t.includes('box') || t.includes('boxes') || t.includes('packaging box') || t.includes('packaging boxes')) {
                return 'Packaging boxes are usually made from cardboard or corrugated board, which are layers of paper-based material engineered to be strong and protective.';
            }
            if (t.includes('disposable item') || t.includes('disposable items')) {
                return 'Disposable items are often made from paper, plastic, or biodegradable materials that are designed for single use, such as disposable plates, cups, and cutlery.';
            }
        }

        return responses.default;
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const newUserMsg = { text: input, isBot: false };
        setMessages((prev) => [...prev, newUserMsg]);
        
        const userText = input;
        setInput('');

        // Basic AI simulation rules
        if (pendingReplyRef.current) clearTimeout(pendingReplyRef.current);
        pendingReplyRef.current = setTimeout(() => {
            const botReply = getBotReply(userText);
            setMessages((prev) => [...prev, { text: botReply, isBot: true }]);
        }, 450); // simulate network delay
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 h-[400px] bg-white rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 transition-all transform scale-100 opacity-100 origin-bottom-right">
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-6 h-6" />
                            <span className="font-semibold tracking-wide">Support Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-blue-200 transition-colors focus:outline-none">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-2 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                    {msg.isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[70%] text-sm p-3 rounded-2xl ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none' : 'bg-blue-600 text-white shadow-md rounded-tr-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                        />
                        <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-300 focus:outline-none"
                    aria-label="Open Chat"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
