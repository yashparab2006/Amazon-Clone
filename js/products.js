const PRODUCTS = [
    {
        id: 1,
        name: "Health & Personal Care Essentials",
        category: "Health & Personal Care",
        price: 499,
        image: "box1_image.jpg",
        description: "Daily wellness kit with vitamins, skincare, and hygiene essentials. Perfect for your health routine.",
        rating: 4.5,
        reviews: 1240,
        deals: false
    },
    {
        id: 2,
        name: "Premium Cotton Clothing Set",
        category: "Clothes",
        price: 1299,
        image: "box2_image.jpg",
        description: "Comfortable cotton apparel for everyday wear. Soft fabric with modern fit.",
        rating: 4.3,
        reviews: 856,
        deals: false
    },
    {
        id: 3,
        name: "Modern Living Room Furniture",
        category: "Furniture",
        price: 8999,
        image: "box3_image.jpg",
        description: "Stylish furniture piece to upgrade your home. Durable build with elegant design.",
        rating: 4.6,
        reviews: 432,
        deals: false
    },
    {
        id: 4,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 2499,
        image: "box4_image.jpg",
        description: "High-quality sound with noise cancellation. 30-hour battery life and fast charging.",
        rating: 4.7,
        reviews: 3421,
        deals: true
    },
    {
        id: 5,
        name: "Beauty & Skincare Collection",
        category: "Beauty Picks",
        price: 799,
        image: "box5_image.jpg",
        description: "Curated beauty products for glowing skin. Dermatologist-tested formulas.",
        rating: 4.4,
        reviews: 967,
        deals: false
    },
    {
        id: 6,
        name: "Pet Care Starter Pack",
        category: "Pet Care",
        price: 649,
        image: "box6_image.jpg",
        description: "Everything your pet needs — food, toys, and grooming supplies in one pack.",
        rating: 4.8,
        reviews: 523,
        deals: false
    },
    {
        id: 7,
        name: "New Arrival Toy Set",
        category: "New Arrival in Toys",
        price: 899,
        image: "box7_image.jpg",
        description: "Fun and educational toys for kids ages 3+. Safe, non-toxic materials.",
        rating: 4.5,
        reviews: 678,
        deals: false
    },
    {
        id: 8,
        name: "Discover Fashion Trends 2023",
        category: "Discover Fashion Trends",
        price: 1599,
        image: "box8_image.jpg",
        description: "Latest fashion trends collection. Trendy styles for every occasion.",
        rating: 4.2,
        reviews: 1105,
        deals: true
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
    let stars = "";
    for (let i = 0; i < full; i++) stars += "★";
    if (half) stars += "½";
    return stars;
}
