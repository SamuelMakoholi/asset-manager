import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import CreateAssetForm from './create-form';
import { fetchCategories, fetchDepartments } from '@/app/lib/data';

export default async function CreateAssetPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }

  const [categories, departments] = await Promise.all([
    fetchCategories(),
    fetchDepartments(),
  ]);

  return <CreateAssetForm userId={session.user.id} categories={categories} departments={departments} />;
}
