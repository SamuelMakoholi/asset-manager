import { redirect } from 'next/navigation';

export default function AdminDashboardPage() {
  // When an admin hits /dashboard/admin, send them to the main admin assets page
  redirect('/dashboard/admin/assets');
}
