import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest, generateToken } from '../middleware/auth';
import { RegisterRequest, LoginRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterRequest = req.body;

      // Basic validation
      if (!data.name || !data.email || !data.password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }

      if (data.password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      const result = await UserService.register(data);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: result.user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginRequest = req.body;

      if (!data.email || !data.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await UserService.login(data);

      if (!result.success) {
        res.status(401).json({ error: result.error });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await UserService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { name, phone } = req.body;
      const updatedUser = await UserService.updateUser(req.user.id, { name, phone });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    // In a real implementation, you might want to invalidate the token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}