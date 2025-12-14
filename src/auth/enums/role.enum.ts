/**
 * Role Enum
 * 
 * Defines user roles in the system.
 * Mirrors the Role enum in Prisma schema.
 * 
 * - USER: Regular citizen users
 * - VILLAGE_OFFICER: GN (Gram Niladhari) Officers
 * - ADMIN: System administrators
 */
export enum Role {
  USER = 'USER',
  VILLAGE_OFFICER = 'VILLAGE_OFFICER',
  ADMIN = 'ADMIN',
}
