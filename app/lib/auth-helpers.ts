import { TokenPayload } from './jwt';

/**
 * Client-side token management utilities
 */
export class AuthTokenManager {
  private static readonly TOKEN_KEY = 'auth-token';
  private static readonly USER_KEY = 'user-data';

  /**
   * Store token and user data in localStorage
   */
  static setAuthData(token: string, userData: TokenPayload): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      
      // Also set as httpOnly cookie for server-side access
      document.cookie = `${this.TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
  }

  /**
   * Get token from localStorage
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get user data from localStorage
   */
  static getUserData(): TokenPayload | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.role === 'admin';
  }

  /**
   * Clear authentication data
   */
  static clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      
      // Clear cookie
      document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  /**
   * Get authorization header for API requests
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
