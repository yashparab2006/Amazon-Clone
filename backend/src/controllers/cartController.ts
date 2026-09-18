import { Request, Response } from 'express';
import { CartService } from '../services/cartService';
import { AuthRequest } from '../middleware/auth';

export class CartController {
  static async getCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const cartItems = await CartService.getCartByUserId(req.user.id);
      const total = await CartService.getCartTotal(req.user.id);
      const count = await CartService.getCartItemCount(req.user.id);

      res.status(200).json({
        success: true,
        items: cartItems,
        total,
        count
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addToCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        res.status(400).json({ error: 'Product ID and quantity are required' });
        return;
      }

      if (quantity < 1) {
        res.status(400).json({ error: 'Quantity must be at least 1' });
        return;
      }

      const cartItem = await CartService.addToCart(req.user.id, Number(productId), Number(quantity));

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        item: cartItem
      });
    } catch (error: any) {
      console.error('Add to cart error:', error);
      res.status(400).json({ error: error.message || 'Failed to add item to cart' });
    }
  }

  static async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity) {
        res.status(400).json({ error: 'Quantity is required' });
        return;
      }

      const updatedItem = await CartService.updateCartItem(req.user.id, Number(productId), Number(quantity));

      if (!updatedItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Cart item updated',
        item: updatedItem
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async removeFromCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { productId } = req.params;
      const removedItem = await CartService.removeFromCart(req.user.id, Number(productId));

      if (!removedItem) {
        res.status(404).json({ error: 'Cart item not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async clearCart(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await CartService.clearCart(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Cart cleared'
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}