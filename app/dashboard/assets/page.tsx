import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchFilteredAssets } from '@/app/lib/data';
import { deleteAsset } from '@/app/lib/actions';
import { getCurrentUser } from '@/app/lib/server-auth';

export default async function AssetsPage({ searchParams }: { searchParams?: { query?: string; page?: string; } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const assets = await fetchFilteredAssets(query, currentPage, user.userId, false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assets</CardTitle>
        <CardDescription>Manage your created assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/assets/create">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Asset
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.category_name}</TableCell>
                <TableCell>{asset.department_name}</TableCell>
                <TableCell>
                  {asset.purchase_date
                    ? new Date(asset.purchase_date as any).toLocaleDateString()
                    : ''}
                </TableCell>
                <TableCell>{asset.cost}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/dashboard/assets/${asset.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/assets/${asset.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server';
                      await deleteAsset(asset.id);
                    }}>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
