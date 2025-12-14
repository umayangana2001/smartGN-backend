import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 * 
 * Extracts the authenticated user from the request object.
 * The user object is populated by JwtAuthGuard after token validation.
 * 
 * User object contains:
 * - id: User ID from JWT payload
 * - email: User email
 * - role: User role (USER, VILLAGE_OFFICER, ADMIN)
 * - type: User type ('user' or 'village_officer')
 * 
 * @example
 * getProfile(@CurrentUser() user: any) {
 *   return this.service.getProfile(user.id);
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

