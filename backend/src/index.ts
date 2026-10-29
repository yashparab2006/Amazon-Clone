import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Routes
import pageRoutes from './routes/pageRoutes';
import authRoutes from './routes/authRoutes';
import productApiRoutes from './routes/productRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ─── View Engine (EJS) ────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
const viewsDir = fs.existsSync(path.join(__dirname, 'views'))
  ? path.join(__dirname, 'views')
  : path.resolve(__dirname, '..', 'src', 'views');
app.set('views', viewsDir);

// ─── Root path to frontend static assets ─────────────────────────────────────
const projectRoot = path.resolve(__dirname, '..', '..'); // 01_Amazon_CLone/

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // relax CSP for external CDNs & fonts
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for auth & flash messages
app.use(session({
  secret: process.env.SESSION_SECRET || 'amazon-clone-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ─── Page & API Routes (Handled by EJS) ───────────────────────────────────────
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productApiRoutes);

// ─── Static Assets (CSS, JS, Images) ──────────────────────────────────────────
app.use('/js', express.static(path.join(projectRoot, 'js')));
app.use('/style.css', (_req: Request, res: Response) => {
  res.sendFile(path.join(projectRoot, 'style.css'));
});
app.use(express.static(projectRoot, { index: false }));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    user: null,
    categories: [],
    selectedCategory: 'All',
    searchQuery: ''
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Amazon Clone Server running at http://localhost:${PORT}`);
  console.log(`📄 EJS view engine enabled at ${viewsDir}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
