import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

/**
 * Metadata key for storing role requirements
 */
export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * 
 * Specifies which roles are allowed to access an endpoint.
 * Use with @UseGuards(RolesGuard) to enforce role-based access.
 * 
 * @param roles - One or more roles that can access the endpoint
 * 
 * @example
 * @Roles(Role.ADMIN)
 * @Roles(Role.ADMIN, Role.VILLAGE_OFFICER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
