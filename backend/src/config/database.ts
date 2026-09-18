// Database configuration for MySQL
// This will be used when MySQL is properly installed

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Connection status
let isConnected = false;

export function setConnectionStatus(status: boolean) {
  isConnected = status;
}

export function getConnectionStatus(): boolean {
  return isConnected;
}

// For now, we'll use localStorage as a fallback until MySQL is set up
export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    // Fallback to localStorage-based implementation
    console.log('Database query (fallback to localStorage):', sql);
    return this.executeLocalStorageQuery(sql, params);
  }

  private executeLocalStorageQuery(sql: string, params?: any[]): Promise<any> {
    // This is a temporary fallback until MySQL is properly configured
    // In production, this would be replaced with actual MySQL queries
    return Promise.resolve([]);
  }
}

export const db = DatabaseService.getInstance();