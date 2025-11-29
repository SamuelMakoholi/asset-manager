import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdminPages = nextUrl.pathname.startsWith('/dashboard/admin');
      
      // If user is logged in and trying to access admin pages, check if they're an admin
      if (isLoggedIn && isOnAdminPages) {
        return auth.user.role === 'admin';
      }
      
      // If user is logged in and trying to access dashboard, allow
      if (isLoggedIn && isOnDashboard) {
        return true;
      }
      
      // If user is not logged in and trying to access dashboard, redirect to login
      if (!isLoggedIn && isOnDashboard) {
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [], // configured in auth.ts
} satisfies NextAuthConfig;
