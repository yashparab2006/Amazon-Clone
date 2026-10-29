import { Router } from 'express';
import * as auth from '../controllers/authControllerWeb';

const router = Router();

router.post('/login', auth.loginPost);
router.post('/register', auth.registerPost);
router.get('/logout', auth.logout);

export default router;
