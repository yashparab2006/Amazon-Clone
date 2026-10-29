import { Request, Response } from 'express';
import {
  CATEGORIES, searchProducts, getDealsProducts,
  getProductById, getRelatedProducts, renderStars, formatNumber
} from '../data/products';

// Helpers passed to every EJS template
const ejsHelpers = {
  stars: renderStars,
  formatNum: formatNumber
};

function getUser(req: Request) {
  return (req.session as any)?.user || null;
}

function baseLocals(req: Request) {
  return {
    user: getUser(req),
    categories: CATEGORIES,
    selectedCategory: 'All',
    searchQuery: '',
    ...ejsHelpers
  };
}

// GET /
export function home(req: Request, res: Response): void {
  const search = (req.query.search as string) || '';
  const category = (req.query.category as string) || 'All';
  const filter = req.query.filter as string | undefined;

  let products = filter === 'deals'
    ? getDealsProducts()
    : searchProducts(search, category);

  res.render('index', {
    ...baseLocals(req),
    title: 'Amazon',
    products,
    selectedCategory: category,
    searchQuery: search
  });
}

// GET /product/:id or /product-detail.html?id=...
export function productDetail(req: Request, res: Response): void {
  const rawId = req.params.id || (req.query.id as string);
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = parseInt(idStr || '0', 10);
  const product = getProductById(id);

  if (!product) {
    res.status(404).render('404', { ...baseLocals(req), title: 'Not Found' });
    return;
  }

  const related = getRelatedProducts(id, product.category, 4);

  res.render('product-detail', {
    ...baseLocals(req),
    title: product.name,
    product,
    related
  });
}

// GET /cart
export function cart(req: Request, res: Response): void {
  res.render('cart', {
    ...baseLocals(req),
    title: 'Shopping Cart'
  });
}

// GET /checkout
export function checkout(req: Request, res: Response): void {
  res.render('checkout', {
    ...baseLocals(req),
    title: 'Checkout',
    orderSuccess: false,
    orderId: null
  });
}

// POST /checkout/place-order
export function placeOrder(req: Request, res: Response): void {
  const orderId = 'ORD-' + Date.now();
  res.render('checkout', {
    ...baseLocals(req),
    title: 'Order Confirmed',
    orderSuccess: true,
    orderId
  });
}

// GET /login
export function loginPage(req: Request, res: Response): void {
  const session = req.session as any;
  res.render('login', {
    ...baseLocals(req),
    title: 'Sign In',
    error: session.flash_error || null,
    success: session.flash_success || null,
    formData: session.flash_formData || null
  });
  session.flash_error = null;
  session.flash_success = null;
  session.flash_formData = null;
}

// GET /register
export function registerPage(req: Request, res: Response): void {
  const session = req.session as any;
  res.render('register', {
    ...baseLocals(req),
    title: 'Create Account',
    error: session.flash_error || null,
    formData: session.flash_formData || null
  });
  session.flash_error = null;
  session.flash_formData = null;
}

// GET /customer-service
export function customerService(req: Request, res: Response): void {
  res.render('customer-service', {
    ...baseLocals(req),
    title: 'Customer Service'
  });
}

// GET /registry
export function registry(req: Request, res: Response): void {
  res.render('registry', {
    ...baseLocals(req),
    title: 'Amazon Registry & Gifting'
  });
}

// GET /gift-cards
export function giftCards(req: Request, res: Response): void {
  res.render('gift-cards', {
    ...baseLocals(req),
    title: 'Amazon Gift Cards'
  });
}

// GET /sell
export function sell(req: Request, res: Response): void {
  res.render('sell', {
    ...baseLocals(req),
    title: 'Sell on Amazon'
  });
}

// GET /careers
export function careers(req: Request, res: Response): void {
  res.render('careers', {
    ...baseLocals(req),
    title: 'Amazon Careers - Come Build With Us'
  });
}

// GET /about
export function about(req: Request, res: Response): void {
  res.render('about', {
    ...baseLocals(req),
    title: 'About Amazon'
  });
}

// GET /affiliate
export function affiliate(req: Request, res: Response): void {
  res.render('affiliate', {
    ...baseLocals(req),
    title: 'Amazon Associates - Affiliate Program'
  });
}

// GET /amazon-pay
export function amazonPay(req: Request, res: Response): void {
  res.render('amazon-pay', {
    ...baseLocals(req),
    title: 'Amazon Pay'
  });
}

// GET /shop-with-points
export function shopWithPoints(req: Request, res: Response): void {
  res.render('shop-with-points', {
    ...baseLocals(req),
    title: 'Shop with Points - Amazon'
  });
}

// GET /account
export function account(req: Request, res: Response): void {
  res.render('account', {
    ...baseLocals(req),
    title: 'Your Account'
  });
}

// GET /orders
export function orders(req: Request, res: Response): void {
  res.render('orders', {
    ...baseLocals(req),
    title: 'Your Orders'
  });
}
