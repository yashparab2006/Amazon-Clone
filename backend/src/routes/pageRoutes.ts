import { Router } from 'express';
import * as page from '../controllers/pageController';

const router = Router();

// Page routes (supports both clean URLs and .html extensions)
router.get('/', page.home);
router.get('/index.html', page.home);

router.get('/product/:id', page.productDetail);
router.get('/product-detail.html', page.productDetail);

router.get('/cart', page.cart);
router.get('/cart.html', page.cart);

router.get('/checkout', page.checkout);
router.get('/checkout.html', page.checkout);
router.post('/checkout/place-order', page.placeOrder);

router.get('/login', page.loginPage);
router.get('/login.html', page.loginPage);

router.get('/register', page.registerPage);
router.get('/register.html', page.registerPage);

// Feature navigation pages
router.get('/customer-service', page.customerService);
router.get('/customer-service.html', page.customerService);
router.get('/help', page.customerService);
router.get('/help.html', page.customerService);

router.get('/registry', page.registry);
router.get('/registry.html', page.registry);

router.get('/gift-cards', page.giftCards);
router.get('/gift-cards.html', page.giftCards);

router.get('/sell', page.sell);
router.get('/sell.html', page.sell);

// Footer & Account pages
router.get('/careers', page.careers);
router.get('/careers.html', page.careers);

router.get('/about', page.about);
router.get('/about.html', page.about);

router.get('/affiliate', page.affiliate);
router.get('/affiliate.html', page.affiliate);

router.get('/amazon-pay', page.amazonPay);
router.get('/amazon-pay.html', page.amazonPay);

router.get('/shop-with-points', page.shopWithPoints);
router.get('/shop-with-points.html', page.shopWithPoints);

router.get('/account', page.account);
router.get('/account.html', page.account);

router.get('/orders', page.orders);
router.get('/orders.html', page.orders);

export default router;
