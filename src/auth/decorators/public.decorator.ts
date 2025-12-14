import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for marking endpoints as public
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public Decorator
 * 
 * Marks an endpoint as publicly accessible, bypassing JWT authentication.
 * Use this on login, register, and other public endpoints.
 * 
 * @example
 * @Post('login')
 * @Public()
 * login() { }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

