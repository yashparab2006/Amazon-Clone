import { Order, OrderItem, Address, OrderRequest } from '../types';
import { CartService } from './cartService';
import { ProductService } from './productService';

// In-memory storage (will be replaced with MySQL)
let orders: Order[] = [];
let orderItems: OrderItem[] = [];
let addresses: Address[] = [];

export class OrderService {
  static async createOrder(userId: number, orderData: OrderRequest): Promise<Order> {
    // Calculate total amount
    let totalAmount = 0;
    const newOrderItems: OrderItem[] = [];

    for (const item of orderData.items) {
      const product = await ProductService.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;

      newOrderItems.push({
        id: orderItems.length + 1,
        orderId: orders.length + 1,
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: product.price
      });

      // Update stock
      await ProductService.updateStock(item.productId, product.stock - item.quantity);
    }

    // Create order
    const newOrder: Order = {
      id: orders.length + 1,
      orderId: `AMZ-${Date.now()}`,
      userId,
      totalAmount,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    orderItems.push(...newOrderItems);

    // Save address
    if (orderData.address) {
      const newAddress: Address = {
        ...orderData.address,
        id: addresses.length + 1,
        userId,
        isDefault: false
      };
      addresses.push(newAddress);
    }

    // Clear cart
    await CartService.clearCart(userId);

    return newOrder;
  }

  static async getOrdersByUserId(userId: number): Promise<Order[]> {
    return orders.filter(order => order.userId === userId);
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    return orders.find(order => order.orderId === orderId) || null;
  }

  static async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return orderItems.filter(item => item.orderId === orderId);
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const order = orders.find(order => order.orderId === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  static async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> {
    const order = orders.find(order => order.orderId === orderId);
    if (!order) return null;

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  static async getAllOrders(): Promise<Order[]> {
    return orders;
  }
}