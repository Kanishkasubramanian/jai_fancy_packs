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
const generateProducts = (createdUsers = []) => {
    const products = [];
    
    // Fixed, direct image URLs (no source.unsplash.com randomness)
    // Base URLs are direct Unsplash CDN links; we append sizing/crop params.
    const categoryBaseImages = {
        tissue: [
            'https://images.unsplash.com/photo-1609840112990-4265448268d1',
            'https://images.unsplash.com/photo-1758846945932-956e5a87fa69',
            'https://images.unsplash.com/photo-1618034229737-cb68d1277aa1',
            'https://images.unsplash.com/photo-1513884923967-4b182ef167ab',
            'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        ],
        'paper bags': [
            'https://images.unsplash.com/photo-1633414654227-2b5ea828b3ef',
            'https://images.unsplash.com/photo-1513884923967-4b182ef167ab',
            'https://images.unsplash.com/photo-1760565030307-f05068b2585d',
            'https://images.unsplash.com/photo-1680034977375-3d83ee017e52',
            'https://images.unsplash.com/photo-1760565030243-c92ed557e8da',
        ],
        'customized bags': [
            'https://images.unsplash.com/photo-1535981444082-2a5dc0548ef3',
            'https://images.unsplash.com/photo-1755634457762-71ef6e7f0ca4',
            'https://images.unsplash.com/photo-1574365569389-a10d488ca3fb',
            'https://images.unsplash.com/photo-1732782703007-91c4ee3bc23d',
            'https://images.unsplash.com/photo-1763634708808-c56bf88021fd',
        ],
        'gift bags': [
            'https://images.unsplash.com/photo-1512698836690-72fdcf254379',
            'https://images.unsplash.com/photo-1764385827344-079d60aa9b8d',
            'https://images.unsplash.com/photo-1732782703007-91c4ee3bc23d',
            'https://images.unsplash.com/photo-1633414654227-2b5ea828b3ef',
            'https://images.unsplash.com/photo-1764764138587-189f22804ec4',
        ],
        'plastic covers': [
            'https://images.unsplash.com/photo-1738044380727-086b16113ab5',
            'https://images.unsplash.com/photo-1593538312756-4e01c72f9bd1',
            'https://images.unsplash.com/photo-1627377948281-6b67fd9eda5b',
            'https://images.unsplash.com/photo-1608917569764-2468aa417c3e',
            'https://images.unsplash.com/photo-1719754519952-213032732b90',
        ],
        'packaging boxes': [
            'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc',
            'https://images.unsplash.com/photo-1686632800715-b705ba1b0eb6',
            'https://images.unsplash.com/photo-1638501478003-4e9761dcfe22',
            'https://images.unsplash.com/photo-1687190380431-c7cef1378247',
            'https://images.unsplash.com/photo-1758351507026-71ad3645cb43',
        ],
        'courier bags': [
            'https://images.unsplash.com/photo-1740842028123-56fd319de33a',
            'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            'https://images.unsplash.com/photo-1609840112990-4265448268d1',
            'https://images.unsplash.com/photo-1695654398992-125945541043',
            'https://images.unsplash.com/photo-1578575437130-527eed3abbec',
        ],
        'wrapping items': [
            'https://images.unsplash.com/photo-1764385827344-079d60aa9b8d',
            'https://images.unsplash.com/photo-1611608822621-fcfcf6a69baf',
            'https://images.unsplash.com/photo-1764764138587-189f22804ec4',
            'https://images.unsplash.com/photo-1595481197464-eddddfe2624c',
            'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        ],
        'disposable items': [
            'https://images.unsplash.com/photo-1612994503408-1749e15638b4',
            'https://images.unsplash.com/photo-1516011762365-b3ae4a895b51',
            'https://images.unsplash.com/photo-1593538312756-4e01c72f9bd1',
            'https://images.unsplash.com/photo-1605821771565-35e0d046a2fb',
            'https://images.unsplash.com/photo-1653428518192-ef72ff439c6a',
        ],
    };

    const buildImageUrl = (baseUrl) => {
        const params = new URLSearchParams({
            ixlib: 'rb-4.0.3',
            auto: 'format',
            fit: 'crop',
            w: '1200',
            h: '1200',
            q: '80',
            crop: 'entropy',
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const reviewComments = [
        'Great quality and premium finish.',
        'Strong material and looks professional.',
        'Exactly as described. Good for business use.',
        'Nice packaging and fast delivery.',
        'Value for money. Will order again.',
    ];

    const pickReviewers = () => {
        const nonAdmin = createdUsers.filter((u) => !u.isAdmin);
        return nonAdmin.length > 0 ? nonAdmin : createdUsers;
    };

    const reviewers = pickReviewers();

    const makeReviewsForProduct = (productIndexSeed) => {
        if (!reviewers || reviewers.length === 0) return [];
        const count = Math.min(2, reviewers.length);
        const start = productIndexSeed % reviewers.length;
        const picked = Array.from({ length: count }, (_, idx) => reviewers[(start + idx) % reviewers.length]);

        return picked.map((u, idx) => ({
            name: u.name,
            rating: Number((((productIndexSeed + idx) % 3) + 3).toFixed(0)), // 3..5
            comment: reviewComments[(productIndexSeed + idx) % reviewComments.length],
            user: u._id,
        }));
    };

    const averageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        return Number((sum / reviews.length).toFixed(1));
    };

    categories.forEach((category) => {
        for (let i = 1; i <= 5; i++) {
            const catName = category.charAt(0).toUpperCase() + category.slice(1);
            const productName = `Premium ${catName} Style ${i}`;
            
            const pool = categoryBaseImages[category] || categoryBaseImages['packaging boxes'];
            const baseImage = pool[(categories.indexOf(category) * 5 + (i - 1)) % pool.length];
            const imageUrl = buildImageUrl(baseImage);

            const productSeed = categories.indexOf(category) * 10 + i;
            const reviews = makeReviewsForProduct(productSeed);

            products.push({
                name: productName,
                images: [
                    { angle: "front", url: imageUrl }
                ],
                description: `High quality ${category} perfect for your needs. Featuring premium materials and excellent durability. Ideal for retail, packaging, gifting, and everyday commercial use. Style ${i} offers optimal dimensions.`,
                category: category,
                price: Math.floor(Math.random() * (500 - 50 + 1) + 50),
                countInStock: Math.floor(Math.random() * 100) + 10,
                reviews,
                rating: averageRating(reviews),
                numReviews: reviews.length,
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

        const sampleProducts = generateProducts(createdUsers);

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