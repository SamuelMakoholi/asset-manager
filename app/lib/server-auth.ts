import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export type AuthUserRole = 'admin' | 'user';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: AuthUserRole;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}
