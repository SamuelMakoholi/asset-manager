import jwt from 'jsonwebtoken';
import { User } from './definitions';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

/**
 * Generate a JWT token
 */
export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'asset-manager',
    subject: user.id
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookies(cookieString: string | undefined): string | null {
  if (!cookieString) return null;
  
  const cookies = cookieString.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  if (!authCookie) return null;
  return authCookie.split('=')[1];
}
