import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const localWishlist = localStorage.getItem('wishlistItems');
        if (localWishlist) {
            setWishlistItems(JSON.parse(localWishlist));
        }
    }, []);

    const toggleWishlist = (product) => {
        const existItem = wishlistItems.find((x) => x.product === product._id);
        let updatedWishlist;
        
        if (existItem) {
            // Remove from wishlist
            updatedWishlist = wishlistItems.filter((x) => x.product !== product._id);
        } else {
            // Add to wishlist
            updatedWishlist = [...wishlistItems, {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                rating: product.rating,
                numReviews: product.numReviews,
            }];
        }
        
        setWishlistItems(updatedWishlist);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    };

    const inWishlist = (id) => {
        return !!wishlistItems.find((x) => x.product === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, inWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
