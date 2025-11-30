import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const token = await getToken({ req: { cookies: cookies() } as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
    </div>
  );
}
