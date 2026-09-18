import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { AuthRequest } from '../middleware/auth';

export class OrderController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const orderData = req.body;

      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        res.status(400).json({ error: 'Order must contain at least one item' });
        return;
      }

      if (!orderData.paymentMethod) {
        res.status(400).json({ error: 'Payment method is required' });
        return;
      }

      const order = await OrderService.createOrder(req.user.id, orderData);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
      });
    } catch (error: any) {
      console.error('Create order error:', error);
      res.status(400).json({ error: error.message || 'Failed to create order' });
    }
  }

  static async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const orders = await OrderService.getOrdersByUserId(req.user.id);

      res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Check if user owns this order
      if (order.userId !== req.user.id && !req.user.isAdmin) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const orderItems = await OrderService.getOrderItems(order.id);

      res.status(200).json({
        success: true,
        order: {
          ...order,
          items: orderItems
        }
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);

      if (!updatedOrder) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const orders = await OrderService.getAllOrders();

      res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}