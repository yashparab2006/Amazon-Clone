import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { AuthRequest, requireAdmin } from '../middleware/auth';

export class ProductController {
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, deals } = req.query;

      let products;

      if (deals === 'true') {
        products = await ProductService.getDealsProducts();
      } else if (search && typeof search === 'string') {
        products = await ProductService.searchProducts(search);
      } else if (category && typeof category === 'string') {
        products = await ProductService.getProductsByCategory(category);
      } else {
        products = await ProductService.getAllProducts();
      }

      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(Number(id));

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const productData = req.body;
      const newProduct = await ProductService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await ProductService.updateProduct(Number(id), updateData);

      if (!updatedProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ProductService.deleteProduct(Number(id));

      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const products = await ProductService.searchProducts(q);

      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}