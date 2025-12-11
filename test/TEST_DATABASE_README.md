# Test Database Files

⚠️ **FOR TESTING PURPOSES ONLY - DO NOT USE IN PRODUCTION!**

## Overview
This folder contains test database configuration for testing authentication endpoints without connecting to the production MySQL database.

## Files
- `.env.test` - Environment variables for testing (SQLite)
- `schema.test.prisma` - Prisma schema for SQLite test database
- `test.db` - SQLite database file (created after running migrations)

## How to Use

### 1. Generate Test Prisma Client
```bash
npx prisma generate --schema=test/schema.test.prisma
```

### 2. Run Migrations
```bash
# Set the test environment
set DATABASE_URL=file:./test/test.db

# Run migrations
npx prisma migrate dev --schema=test/schema.test.prisma --name init
```

### 3. Run API Tests
```bash
npm run test:e2e
```

## Why SQLite?
- No MySQL server required
- File-based, portable
- Perfect for local development and CI/CD testing
- Data stored in `test.db` file

## ⚠️ Important Notes
- This database is for testing ONLY
- Data will be reset frequently
- Do NOT store important data here
- Production uses MySQL (see main `/prisma/schema.prisma`)

---
Created: 2025-12-10
Purpose: Testing authentication and authorization endpoints
