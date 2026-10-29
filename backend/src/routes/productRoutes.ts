import { Router, Request, Response } from 'express';
import { searchProducts, getDealsProducts, getProductById, CATEGORIES } from '../data/products';

const router = Router();

// GET /api/products?search=&category=
router.get('/', (req: Request, res: Response) => {
  const search = (req.query.search as string) || '';
  const category = (req.query.category as string) || 'All';
  const filter = req.query.filter as string | undefined;
  const products = filter === 'deals' ? getDealsProducts() : searchProducts(search, category);
  res.json({ products, categories: CATEGORIES });
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = getProductById(parseInt(rawId, 10));
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product });
});

export default router;
