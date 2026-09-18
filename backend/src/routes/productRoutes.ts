import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticate, ProductController.createProduct);
router.put('/:id', authenticate, ProductController.updateProduct);
router.delete('/:id', authenticate, ProductController.deleteProduct);

export default router;