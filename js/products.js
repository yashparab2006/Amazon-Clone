const PRODUCTS = [
    {
        id: 1,
        name: "Health & Personal Care Essentials",
        category: "Health & Personal Care",
        price: 499,
        originalPrice: 699,
        image: "box1_image.jpg",
        description: "Daily wellness kit with vitamins, skincare, and hygiene essentials. Perfect for your health routine.",
        rating: 4.5,
        reviews: 1240,
        deals: false,
        stock: 50,
        brand: "Amazon Basics"
    },
    {
        id: 2,
        name: "Premium Cotton Clothing Set",
        category: "Clothes",
        price: 1299,
        originalPrice: 1599,
        image: "box2_image.jpg",
        description: "Comfortable cotton apparel for everyday wear. Soft fabric with modern fit.",
        rating: 4.3,
        reviews: 856,
        deals: false,
        stock: 30,
        brand: "Amazon Essentials"
    },
    {
        id: 3,
        name: "Modern Living Room Furniture",
        category: "Furniture",
        price: 8999,
        originalPrice: 12999,
        image: "box3_image.jpg",
        description: "Stylish furniture piece to upgrade your home. Durable build with elegant design.",
        rating: 4.6,
        reviews: 432,
        deals: false,
        stock: 15,
        brand: "Amazon Home"
    },
    {
        id: 4,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 2499,
        originalPrice: 3499,
        image: "box4_image.jpg",
        description: "High-quality sound with noise cancellation. 30-hour battery life and fast charging.",
        rating: 4.7,
        reviews: 3421,
        deals: true,
        stock: 100,
        brand: "Amazon Basics"
    },
    {
        id: 5,
        name: "Beauty & Skincare Collection",
        category: "Beauty Picks",
        price: 799,
        originalPrice: 999,
        image: "box5_image.jpg",
        description: "Curated beauty products for glowing skin. Dermatologist-tested formulas.",
        rating: 4.4,
        reviews: 967,
        deals: false,
        stock: 45,
        brand: "Amazon Beauty"
    },
    {
        id: 6,
        name: "Pet Care Starter Pack",
        category: "Pet Care",
        price: 649,
        originalPrice: 799,
        image: "box6_image.jpg",
        description: "Everything your pet needs — food, toys, and grooming supplies in one pack.",
        rating: 4.8,
        reviews: 523,
        deals: false,
        stock: 60,
        brand: "Amazon Pets"
    },
    {
        id: 7,
        name: "New Arrival Toy Set",
        category: "New Arrival in Toys",
        price: 899,
        originalPrice: 1199,
        image: "box7_image.jpg",
        description: "Fun and educational toys for kids ages 3+. Safe, non-toxic materials.",
        rating: 4.5,
        reviews: 678,
        deals: false,
        stock: 25,
        brand: "Amazon Toys"
    },
    {
        id: 8,
        name: "Discover Fashion Trends 2023",
        category: "Discover Fashion Trends",
        price: 1599,
        originalPrice: 2199,
        image: "box8_image.jpg",
        description: "Latest fashion trends collection. Trendy styles for every occasion.",
        rating: 4.2,
        reviews: 1105,
        deals: true,
        stock: 40,
        brand: "Amazon Fashion"
    },
    {
        id: 9,
        name: "Smart Home Speaker",
        category: "Electronics",
        price: 2999,
        originalPrice: 3999,
        image: "box4_image.jpg",
        description: "Voice-controlled smart speaker with premium sound quality and smart home integration.",
        rating: 4.6,
        reviews: 2156,
        deals: true,
        stock: 75,
        brand: "Amazon Echo"
    },
    {
        id: 10,
        name: "Organic Food Basket",
        category: "Health & Personal Care",
        price: 899,
        originalPrice: 1099,
        image: "box1_image.jpg",
        description: "Fresh organic fruits and vegetables delivered to your doorstep. Weekly subscription available.",
        rating: 4.4,
        reviews: 789,
        deals: false,
        stock: 20,
        brand: "Amazon Fresh"
    },
    {
        id: 11,
        name: "Fitness Tracker Watch",
        category: "Electronics",
        price: 1999,
        originalPrice: 2499,
        image: "box4_image.jpg",
        description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
        rating: 4.5,
        reviews: 1432,
        deals: true,
        stock: 55,
        brand: "Amazon Fitness"
    },
    {
        id: 12,
        name: "Designer Handbag Collection",
        category: "Discover Fashion Trends",
        price: 2499,
        originalPrice: 3499,
        image: "box8_image.jpg",
        description: "Premium leather handbags with elegant designs. Perfect for any occasion.",
        rating: 4.3,
        reviews: 567,
        deals: false,
        stock: 18,
        brand: "Amazon Fashion"
    }
];

const CATEGORIES = [
    "All",
    "Electronics",
    "Clothes",
    "Furniture",
    "Health & Personal Care",
    "Beauty Picks",
    "Pet Care",
    "New Arrival in Toys",
    "Discover Fashion Trends"
];

function getProductById(id) {
    return PRODUCTS.find((p) => p.id === Number(id));
}

function getProductsByCategory(category) {
    if (category === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === category);
}

function searchProducts(query, category = "All") {
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
        const matchesSearch =
            !q ||
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
        const matchesCategory = category === "All" || p.category === category;
        return matchesSearch && matchesCategory;
    });
}

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = "";

    for (let i = 0; i < full; i++) stars += "★";
    if (half) stars += "½";
    for (let i = 0; i < empty; i++) stars += "☆";

    return stars;
}

function calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}

function getDealsProducts() {
    return PRODUCTS.filter(p => p.deals);
}

function getProductsByPriceRange(minPrice, maxPrice) {
    return PRODUCTS.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

function getTopRatedProducts(minRating = 4.5) {
    return PRODUCTS.filter(p => p.rating >= minRating).sort((a, b) => b.rating - a.rating);
}

function getRelatedProducts(productId, category, limit = 4) {
    return PRODUCTS.filter(p => p.category === category && p.id !== productId).slice(0, limit);
}
