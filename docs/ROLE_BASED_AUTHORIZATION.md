# Role-Based Authorization Guide

## Overview

All APIs are **protected by default** with JWT authentication. Use the `@Public()` decorator to make endpoints publicly accessible.

## Roles

- `USER` - Regular users
- `VILLAGE_OFFICER` - GN (Gram Niladhari) Officers
- `ADMIN` - Administrators

## Decorators

### `@Public()`

Marks an endpoint as publicly accessible (no authentication required).

```typescript
import { Public } from './auth/decorators';

@Get('public-endpoint')
@Public()
getPublicData() {
  return { message: 'This is public' };
}
```

### `@Roles(...roles)`

Restricts access to specific roles. Accepts **one or more roles as arguments** (array support).

```typescript
import { Roles } from './auth/decorators';
import { Role } from './auth/enums';

// Single role
@Roles(Role.ADMIN)
adminOnly() { }

// Multiple roles (array)
@Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
adminOrOfficer() { }

// All three roles
@Roles(Role.USER, Role.VILLAGE_OFFICER, Role.ADMIN)
allRoles() { }
```

### `@CurrentUser()`

Gets the authenticated user from the JWT token.

```typescript
import { CurrentUser } from './auth/decorators';

@Get('profile')
getProfile(@CurrentUser() user: any) {
  return { userId: user.id, email: user.email, role: user.role };
}
```

## Usage Examples

### Example 1: Public Endpoint

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators';

@Controller('public')
export class PublicController {
  @Get('info')
  @Public()
  getPublicInfo() {
    return { message: 'Anyone can access this' };
  }
}
```

### Example 2: Authenticated Endpoint (Any Role)

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('protected')
@ApiBearerAuth('JWT-auth')
export class ProtectedController {
  @Get('data')
  getData() {
    // Any authenticated user can access
    return { message: 'Protected data' };
  }
}
```

### Example 3: Single Role Restriction

```typescript
import { Controller, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';

@Controller('admin')
@ApiBearerAuth('JWT-auth')
export class AdminController {
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  createAdminOnly() {
    return { message: 'Only admins can do this' };
  }
}
```

### Example 4: Multiple Roles (Array)

```typescript
import { Controller, Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';

@Controller('requests')
@ApiBearerAuth('JWT-auth')
export class RequestController {
  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
  updateStatus() {
    // Both ADMIN and VILLAGE_OFFICER can access
    return { message: 'Status updated' };
  }
}
```

### Example 5: Using Current User

```typescript
import { Controller, Get, ForbiddenException } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import { Role } from '../auth/enums';

@Controller('profile')
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  @Get(':userId')
  getProfile(@Param('userId') userId: string, @CurrentUser() user: any) {
    // Users can only access their own profile, admins can access any
    if (user.role !== Role.ADMIN && user.id !== userId) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.profileService.getProfile(userId);
  }
}
```

### Example 6: Controller-Level Role Restriction

```typescript
import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '../auth/enums';

@Controller('admin-panel')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminPanelController {
  // All endpoints in this controller require ADMIN role
  
  @Get('dashboard')
  getDashboard() {
    return { data: 'Admin dashboard' };
  }
  
  @Get('users')
  getUsers() {
    return { data: 'All users' };
  }
}
```

## Complete Controller Example

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public, Roles, CurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { Role } from '../auth/enums';

@ApiTags('example')
@Controller('example')
@ApiBearerAuth('JWT-auth')
export class ExampleController {
  
  // Public endpoint - no authentication
  @Get('public')
  @Public()
  getPublic() {
    return { message: 'Public data' };
  }
  
  // Authenticated - any role
  @Get('protected')
  getProtected() {
    return { message: 'Protected data' };
  }
  
  // Admin only
  @Post('admin-only')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'Admin only' };
  }
  
  // Admin or GN Officer
  @Put('update')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
  updateData() {
    return { message: 'Updated by admin or officer' };
  }
  
  // All roles
  @Get('all-roles')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.VILLAGE_OFFICER, Role.ADMIN)
  allRoles() {
    return { message: 'All authenticated users' };
  }
  
  // Using current user
  @Get('me')
  getCurrentUser(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      type: user.type
    };
  }
}
```

## Important Notes

1. **Global Authentication**: All endpoints are protected by default via `APP_GUARD` in `app.module.ts`
2. **Public Endpoints**: Use `@Public()` to bypass authentication
3. **Role Checking**: Always use `@UseGuards(RolesGuard)` with `@Roles()` decorator
4. **Multiple Roles**: Pass multiple roles as separate arguments: `@Roles(Role.ADMIN, Role.VILLAGE_OFFICER)`
5. **User Object**: The `@CurrentUser()` decorator provides: `{ id, email, role, type }`

## Error Responses

- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User doesn't have required role(s)

