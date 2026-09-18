import { Product } from '../types';

// In-memory storage (will be replaced with MySQL)
let products: Product[] = [
  {
    id: 1,
    name: "Health & Personal Care Essentials",
    category: "Health & Personal Care",
    price: 499,
    originalPrice: 699,
    description: "Daily wellness kit with vitamins, skincare, and hygiene essentials. Perfect for your health routine.",
    rating: 4.5,
    reviews: 1240,
    isDeal: false,
    stock: 50,
    brand: "Amazon Basics",
    image: "box1_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Premium Cotton Clothing Set",
    category: "Clothes",
    price: 1299,
    originalPrice: 1599,
    description: "Comfortable cotton apparel for everyday wear. Soft fabric with modern fit.",
    rating: 4.3,
    reviews: 856,
    isDeal: false,
    stock: 30,
    brand: "Amazon Essentials",
    image: "box2_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Modern Living Room Furniture",
    category: "Furniture",
    price: 8999,
    originalPrice: 12999,
    description: "Stylish furniture piece to upgrade your home. Durable build with elegant design.",
    rating: 4.6,
    reviews: 432,
    isDeal: false,
    stock: 15,
    brand: "Amazon Home",
    image: "box3_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 3499,
    description: "High-quality sound with noise cancellation. 30-hour battery life and fast charging.",
    rating: 4.7,
    reviews: 3421,
    isDeal: true,
    stock: 100,
    brand: "Amazon Basics",
    image: "box4_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Beauty & Skincare Collection",
    category: "Beauty Picks",
    price: 799,
    originalPrice: 999,
    description: "Curated beauty products for glowing skin. Dermatologist-tested formulas.",
    rating: 4.4,
    reviews: 967,
    isDeal: false,
    stock: 45,
    brand: "Amazon Beauty",
    image: "box5_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Pet Care Starter Pack",
    category: "Pet Care",
    price: 649,
    originalPrice: 799,
    description: "Everything your pet needs — food, toys, and grooming supplies in one pack.",
    rating: 4.8,
    reviews: 523,
    isDeal: false,
    stock: 60,
    brand: "Amazon Pets",
    image: "box6_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "New Arrival Toy Set",
    category: "New Arrival in Toys",
    price: 899,
    originalPrice: 1199,
    description: "Fun and educational toys for kids ages 3+. Safe, non-toxic materials.",
    rating: 4.5,
    reviews: 678,
    isDeal: false,
    stock: 25,
    brand: "Amazon Toys",
    image: "box7_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Discover Fashion Trends 2023",
    category: "Discover Fashion Trends",
    price: 1599,
    originalPrice: 2199,
    description: "Latest fashion trends collection. Trendy styles for every occasion.",
    rating: 4.2,
    reviews: 1105,
    isDeal: true,
    stock: 40,
    brand: "Amazon Fashion",
    image: "box8_image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    return products;
  }

  static async getProductById(id: number): Promise<Product | null> {
    return products.find(p => p.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) return products;

    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  static async getDealsProducts(): Promise<Product[]> {
    return products.filter(p => p.isDeal);
  }

  static async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: products.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return products[productIndex];
  }

  static async deleteProduct(id: number): Promise<boolean> {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;

    products.splice(productIndex, 1);
    return true;
  }

  static async updateStock(id: number, quantity: number): Promise<Product | null> {
    const product = products.find(p => p.id === id);
    if (!product) return null;

    product.stock = quantity;
    product.updatedAt = new Date().toISOString();
    return product;
  }
}