# GN System Backend

Backend API for Gram Niladhari Service Management System built with NestJS, Prisma, and MySQL.

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="mysql://root:password@localhost:3306/test"
JWT_SECRET="smartgn-secret-key"
AUTO_MIGRATE=true
AUTO_SEED=false
```

**Environment Variables:**

- `DATABASE_URL` - MySQL connection string (format: `mysql://user:password@host:port/database`)
- `JWT_SECRET` - Secret key for JWT token signing
- `AUTO_MIGRATE` - Set to `false` to disable automatic migrations on startup
- `AUTO_SEED` - Set to `true` to automatically create admin user on startup

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This generates TypeScript types from your Prisma schema.

### 4. Run Database Migrations

```bash
# Apply pending migrations
npx prisma migrate deploy
```

**Note:** Migrations run automatically on server startup if `AUTO_MIGRATE=true`.

### 5. Seed Admin User (Optional)

```bash
npm run prisma:seed
```

This creates an admin user:

- **Email:** `admin@hello.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

The seed script is idempotent - safe to run multiple times.

### 6. Start the Server

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

Server runs on `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api`

## Database Commands

### Prisma CLI Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Push schema changes (development only - no migration history)
npx prisma db push

# View database in browser (Prisma Studio)
npx prisma studio

# Check migration status
npx prisma migrate status

# Format Prisma schema
npx prisma format

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

### Seed Commands

```bash
# Create admin user
npm run prisma:seed
```

## Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Start production server
npm run start:prod

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## API Documentation

Once the server is running, access Swagger UI at:

**http://localhost:3000/api**

### Features:

- Interactive API documentation
- Quick login form (pre-filled with admin credentials)
- Test endpoints directly from the browser
- Automatic token management

### Quick Login in Swagger:

1. Open Swagger UI
2. Use the "Quick Login" form at the top
3. Enter credentials (or use pre-filled admin credentials)
4. Click "Login" - token is automatically set
5. Test protected endpoints immediately

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── decorators/    # @Public(), @Roles(), @CurrentUser()
│   ├── guards/        # JWT and role guards
│   ├── strategies/    # JWT strategy
│   └── dto/           # Auth DTOs
├── user-profile/      # User profile management
├── service-request/   # Service request management
└── file-upload/       # File upload handling

prisma/
├── schema.prisma      # Database schema
├── seed.ts            # Database seed script
└── migrations/        # Database migrations
```

## Authentication & Authorization

### Roles

- `USER` - Regular users
- `VILLAGE_OFFICER` - GN Officers
- `ADMIN` - Administrators

### Authentication Endpoints

#### User Authentication (`auth/user`)

- `POST /auth/user/register` - Register a new user
  - **Body:** `{ email, password, role }`
  - **Response:** User object with id, email, role
- `POST /auth/user/login` - User login
  - **Body:** `{ email, password }`
  - **Response:** `{ access_token }` (JWT token)

#### Village Officer Authentication (`auth/village-officer`)

- `POST /auth/village-officer/register` - Register a new village officer
  - **Body:** `{ email, password, role }`
  - **Response:** Village officer object with id, email, role
- `POST /auth/village-officer/login` - Village officer login
  - **Body:** `{ email, password }`
  - **Response:** `{ access_token }` (JWT token)

**Note:** All authentication endpoints are public (no JWT required). After login, use the returned `access_token` in the `Authorization: Bearer <token>` header for protected endpoints.

### Usage

**Public Endpoint:**

```typescript
@Public()
@Get('public')
getPublicData() { }
```

**Protected Endpoint (Any authenticated user):**

```typescript
@Get('protected')
getProtectedData() { }
```

**Role-Based Access:**

```typescript
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
@Get('admin-only')
getAdminData() { }
```

**Get Current User:**

```typescript
@Get('profile')
getProfile(@CurrentUser() user: any) {
  return { id: user.id, email: user.email, role: user.role };
}
```

See `docs/ROLE_BASED_AUTHORIZATION.md` for detailed documentation.

## Common Workflows

### Adding a New Database Model

1. Update `prisma/schema.prisma`
2. Generate Prisma Client: `npx prisma generate`
3. Create migration: `npx prisma migrate dev --name add_new_model`
4. Update your service to use the new model

### Changing Database Schema

1. Modify `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name describe_changes`
3. This creates a migration file and applies it

### Viewing Database Data

```bash
npx prisma studio
```

Opens a browser-based database viewer at `http://localhost:5555`

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `CREATE DATABASE test;`

### Migration Issues

- Check migration status: `npx prisma migrate status`
- If migrations are out of sync, reset (⚠️ deletes data): `npx prisma migrate reset`

### Prisma Client Not Found

- Run: `npx prisma generate`
- Restart your development server

## Admin Credentials (Default)

- **Email:** `admin@hello.com`
- **Password:** `admin123`
- **Role:** `ADMIN`

**⚠️ Change these credentials in production!**

## Additional Documentation

- [Authentication Guide](docs/AUTHENTICATION.md)
- [Role-Based Authorization](docs/ROLE_BASED_AUTHORIZATION.md)

## loging super admin

{
"email": "superadmin@gov.lk",
"password": "SuperAdmin@123"
}

## registerd admins

{
"email": "admin1@gov.lk",
"password": "Admin@1234",
"fullName": "Admin One"
}
