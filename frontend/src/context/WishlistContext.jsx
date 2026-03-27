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

    const getProductId = (item) => item?._id || item?.product;
    const getImageUrl = (item) => {
        if (!item) return 'https://via.placeholder.com/600x600?text=No+Image';
        if (typeof item.image === 'string') return item.image;
        if (typeof item.image?.url === 'string') return item.image.url;
        const images = item.images;
        if (Array.isArray(images) && images.length > 0) {
            return images.find((img) => img.angle === 'front')?.url || images[0]?.url || 'https://via.placeholder.com/600x600?text=No+Image';
        }
        return 'https://via.placeholder.com/600x600?text=No+Image';
    };

    const toggleWishlist = (productOrItem) => {
        const productId = getProductId(productOrItem);
        if (!productId) return;

        const existItem = wishlistItems.find((x) => x.product === productId);
        let updatedWishlist;
        
        if (existItem) {
            // Remove from wishlist
            updatedWishlist = wishlistItems.filter((x) => x.product !== productId);
        } else {
            // Add to wishlist
            updatedWishlist = [...wishlistItems, {
                product: productId,
                name: productOrItem.name,
                image: getImageUrl(productOrItem),
                price: productOrItem.price,
                rating: productOrItem.rating,
                numReviews: productOrItem.numReviews,
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
