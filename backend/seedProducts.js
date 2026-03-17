import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

connectDB();

const categories = [
    'tissue',
    'customized bags',
    'gift bags',
    'paper bags',
    'plastic covers',
    'courier bags',
    'wrapping items',
    'packaging boxes',
    'disposable items'
];
const generateProducts = () => {
    const products = [];
    
    const categoryToSearchTerm = {
        // Required category-specific queries
        'tissue': 'tissue paper pack',
        'customized bags': 'printed tote bag',
        'gift bags': 'gift bag',
        'paper bags': 'paper shopping bag',
        'plastic covers': 'plastic packaging',
        'courier bags': 'shipping parcel bag',
        'wrapping items': 'gift wrapping paper',
        'packaging boxes': 'gift packaging box',
        'disposable items': 'disposable container'
    };

    categories.forEach((category) => {
        for (let i = 1; i <= 5; i++) {
            const catName = category.charAt(0).toUpperCase() + category.slice(1);
            const searchTerm = categoryToSearchTerm[category] || category;
            const productName = `Premium ${catName} Style ${i}`;
            
            // Use dynamic Unsplash URLs with unique signatures per product + angle
            const baseSig = (categories.indexOf(category) + 1) * 1000 + i * 10;
            const generateImageUrl = (angle, sigOffset) =>
                `https://source.unsplash.com/1200x1200/?${encodeURIComponent(`${searchTerm} ${productName} ${angle}`)}&sig=${baseSig + sigOffset}`;

            products.push({
                name: productName,
                images: [
                    { angle: "front", url: generateImageUrl('front', 1) },
                    { angle: "back", url: generateImageUrl('back', 2) },
                    { angle: "left", url: generateImageUrl('left', 3) },
                    { angle: "right", url: generateImageUrl('right', 4) }
                ],
                description: `High quality ${category} perfect for your needs. Featuring premium materials and excellent durability. Ideal for retail, packaging, gifting, and everyday commercial use. Style ${i} offers optimal dimensions.`,
                category: category,
                price: Math.floor(Math.random() * (500 - 50 + 1) + 50),
                countInStock: Math.floor(Math.random() * 100) + 10,
                rating: Number((Math.random() * 2 + 3).toFixed(1)),
                numReviews: Math.floor(Math.random() * 50) + 5,
            });
        }
    });
    return products;
};

const users = [
    {
        name: 'Admin User',
        email: 'admin@jaifancypacks.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
    }
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Hash passwords
        const hashedUsers = await Promise.all(users.map(async u => ({
            ...u,
            password: await bcrypt.hash(u.password, 10)
        })));

        const createdUsers = await User.insertMany(hashedUsers);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = generateProducts();

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
