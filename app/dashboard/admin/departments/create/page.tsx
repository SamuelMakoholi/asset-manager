import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import CreateDepartmentForm from './create-form';

export default async function CreateDepartmentPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }

  return <CreateDepartmentForm userId={session.user.id} />;
}
