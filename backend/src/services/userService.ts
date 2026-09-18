import { User, RegisterRequest, LoginRequest } from '../types';
import { hashPassword, comparePassword, generateToken } from '../middleware/auth';

// In-memory storage (will be replaced with MySQL)
let users: User[] = [
  {
    id: 1,
    email: 'admin@amazon.com',
    name: 'Admin User',
    password: 'hashed_password_here', // Will be hashed
    isAdmin: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class UserService {
  static async register(data: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    // Check if user already exists
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create new user
    const newUser: User = {
      id: users.length + 1,
      email: data.email,
      name: data.name,
      password: hashedPassword,
      phone: data.phone,
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword as User };
  }

  static async login(data: LoginRequest): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    const user = users.find(u => u.email === data.email);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is inactive' };
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { 
      success: true, 
      user: userWithoutPassword as User, 
      token 
    };
  }

  static async getUserById(id: number): Promise<User | null> {
    const user = users.find(u => u.id === id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword as User;
  }

  static async getAllUsers(): Promise<User[]> {
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }
}