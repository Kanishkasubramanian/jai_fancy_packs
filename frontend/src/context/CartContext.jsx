import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const localCart = localStorage.getItem('cartItems');
        if (localCart) {
            setCartItems(JSON.parse(localCart));
        }
    }, []);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x.product === product._id);
        let updatedCart;
        if (existItem) {
            updatedCart = cartItems.map((x) =>
                x.product === existItem.product ? { ...x, qty } : x
            );
        } else {
            const item = {
                product: product._id,
                name: product.name,
                image: product.images && product.images.length > 0
                  ? (product.images.find(img => img.angle === 'front')?.url || product.images[0].url)
                  : 'https://placehold.co/600x600',
                price: product.price,
                countInStock: product.countInStock,
                qty: Number(qty),
            };
            updatedCart = [...cartItems, item];
        }
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter((x) => x.product !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
