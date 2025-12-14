import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT Payload Interface
 * 
 * Structure of data stored in JWT tokens
 */
export interface JwtPayload {
  sub: string; // User ID (subject)
  email: string; // User email
  role: string; // User role (USER, VILLAGE_OFFICER, ADMIN)
  type: 'user' | 'village_officer'; // User type for distinguishing user vs officer
}

/**
 * JWT Strategy
 * 
 * Passport strategy for validating JWT tokens.
 * Extracts token from Authorization header and validates it.
 * The validated payload is attached to the request as req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'smartgn-secret-key',
    });
  }

  /**
   * Validate and transform JWT payload
   * 
   * This method is called after the token is verified.
   * The returned object is attached to req.user
   * 
   * @param payload - Decoded JWT payload
   * @returns User object to attach to request
   */
  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      type: payload.type,
    };
  }
}
