import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Simple in-memory user store (replace with a database in production)
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const users: UserRecord[] = [];

// POST /auth/login
export function loginPost(req: Request, res: Response): void {
  const { email, password } = req.body;
  const session = req.session as any;

  if (!email || !password) {
    session.flash_error = 'Email and password are required.';
    session.flash_formData = { email };
    res.redirect('/login');
    return;
  }

  const user = users.find(u => u.email === email.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    session.flash_error = 'Invalid email or password.';
    session.flash_formData = { email };
    res.redirect('/login');
    return;
  }

  session.user = { id: user.id, name: user.name, email: user.email };
  res.redirect('/');
}

// POST /auth/register
export function registerPost(req: Request, res: Response): void {
  const { name, email, password, confirmPassword } = req.body;
  const session = req.session as any;

  if (!name || !email || !password || !confirmPassword) {
    session.flash_error = 'All fields are required.';
    session.flash_formData = { name, email };
    res.redirect('/register');
    return;
  }

  if (password !== confirmPassword) {
    session.flash_error = 'Passwords do not match.';
    session.flash_formData = { name, email };
    res.redirect('/register');
    return;
  }

  if (password.length < 6) {
    session.flash_error = 'Password must be at least 6 characters.';
    session.flash_formData = { name, email };
    res.redirect('/register');
    return;
  }

  if (users.some(u => u.email === email.toLowerCase())) {
    session.flash_error = 'An account with this email already exists.';
    session.flash_formData = { name, email };
    res.redirect('/register');
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser: UserRecord = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  session.flash_success = 'Account created! Please sign in.';
  res.redirect('/login');
}

// GET /auth/logout
export function logout(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.redirect('/');
  });
}
