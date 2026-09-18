# Amazon Clone Backend API

## Week 1 Complete: Node.js + Express.js + TypeScript Setup

### ✅ Completed Tasks

1. **Node.js Installation**
   - Installed Node.js v20.11.1 LTS
   - Verified npm v10.2.4

2. **Project Initialization**
   - Created backend directory structure
   - Initialized npm project
   - Configured TypeScript with tsconfig.json

3. **Dependencies Installed**
   - **Production:** express, cors, helmet, dotenv
   - **Development:** typescript, @types/node, @types/express, @types/cors, tsx

4. **Project Structure**
   ```
   backend/
   ├── src/
   │   ├── controllers/     # Request handlers
   │   ├── services/        # Business logic
   │   ├── models/          # Database models
   │   ├── middleware/      # Express middleware
   │   ├── routes/          # API routes
   │   ├── utils/           # Utility functions
   │   ├── validators/      # Request validation schemas
   │   ├── config/          # Configuration files
   │   ├── types/           # TypeScript types
   │   └── index.ts         # Entry point
   ├── dist/                # Compiled JavaScript
   ├── node_modules/        # Dependencies
   ├── .env                 # Environment variables
   ├── .gitignore          # Git ignore rules
   ├── package.json        # Project configuration
   └── tsconfig.json       # TypeScript configuration
   ```

5. **Express Server Setup**
   - Configured Express with TypeScript
   - Added security middleware (Helmet)
   - Added CORS support
   - Added JSON body parsing
   - Created health check endpoint
   - Added error handling middleware

6. **Environment Configuration**
   - Created .env file for environment variables
   - Configured port and environment settings

### 🚀 Available Scripts

```bash
# Development (compile and run)
npm run dev

# Development with watch mode
npm run dev:watch

# Build TypeScript to JavaScript
npm run build

# Start production server
npm run start
```

### 📝 Current Features

- ✅ Express server running on port 3000
- ✅ TypeScript compilation
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ JSON body parsing
- ✅ Error handling middleware
- ✅ Health check endpoint at `/`

### 🔧 Environment Variables

```env
PORT=3000
NODE_ENV=development
```

### 🎯 Next Steps (Week 2)

1. Set up MySQL database
2. Install and configure Prisma ORM
3. Create database schema
4. Implement basic API structure
5. Add authentication system

### 📦 Dependencies

**Production:**
- express: ^5.2.1
- cors: ^2.8.6
- helmet: ^8.3.0
- dotenv: ^17.4.2

**Development:**
- typescript: ^7.0.2
- @types/node: ^26.5.0
- @types/express: ^5.0.6
- @types/cors: ^2.8.19
- tsx: ^4.19.2

### 🔍 Testing the Server

Start the server:
```bash
npm run start
```

Test the health endpoint:
```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "Amazon Clone API",
  "version": "1.0.0",
  "status": "running"
}
```

---

**Status:** Week 1 Complete ✅
**Next:** Database Setup (Week 2)