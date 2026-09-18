import { CartItem, Product } from '../types';
import { ProductService } from './productService';

// In-memory storage (will be replaced with MySQL)
let cartItems: CartItem[] = [];

export class CartService {
  static async getCartByUserId(userId: number): Promise<CartItem[]> {
    return cartItems.filter(item => item.userId === userId);
  }

  static async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    // Check if product exists and has enough stock
    const product = await ProductService.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find(
      item => item.userId === userId && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    }

    const newItem: CartItem = {
      id: cartItems.length + 1,
      userId,
      productId,
      quantity,
      createdAt: new Date().toISOString()
    };

    cartItems.push(newItem);
    return newItem;
  }

  static async updateCartItem(userId: number, productId: number, quantity: number): Promise<CartItem | null> {
    const item = cartItems.find(
      item => item.userId === userId && item.productId === productId
    );

    if (!item) return null;

    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    item.quantity = quantity;
    return item;
  }

  static async removeFromCart(userId: number, productId: number): Promise<CartItem | null> {
    const itemIndex = cartItems.findIndex(
      item => item.userId === userId && item.productId === productId
    );

    if (itemIndex === -1) return null;

    const [removedItem] = cartItems.splice(itemIndex, 1);
    return removedItem;
  }

  static async clearCart(userId: number): Promise<void> {
    cartItems = cartItems.filter(item => item.userId !== userId);
  }

  static async getCartTotal(userId: number): Promise<number> {
    const userCartItems = await this.getCartByUserId(userId);
    let total = 0;

    for (const item of userCartItems) {
      const product = await ProductService.getProductById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    return total;
  }

  static async getCartItemCount(userId: number): Promise<number> {
    const userCartItems = await this.getCartByUserId(userId);
    return userCartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}