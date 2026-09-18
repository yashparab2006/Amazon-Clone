import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, CartController.getCart);
router.post('/', authenticate, CartController.addToCart);
router.put('/:productId', authenticate, CartController.updateCartItem);
router.delete('/:productId', authenticate, CartController.removeFromCart);
router.delete('/', authenticate, CartController.clearCart);

export default router;