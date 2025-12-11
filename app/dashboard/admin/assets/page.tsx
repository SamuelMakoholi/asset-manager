import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchFilteredAssets } from '@/app/lib/data';
import { deleteAsset } from '@/app/lib/actions';
import { getCurrentUser } from '@/app/lib/server-auth';
import WarrantyMessageBanner from '@/app/components/warranty-message-banner';

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ query?: string; page?: string; warranty?: string; message?: string; }> }) {

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const query = params.query ?? '';
  const currentPage = Number(params.page ?? '1') || 1;

  const warrantyStatus = params.warranty;
  const warrantyMessage = params.message ? decodeURIComponent(params.message) : undefined;

  const assets = await fetchFilteredAssets(query, currentPage, null, true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>Manage all company assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <WarrantyMessageBanner status={warrantyStatus as 'success' | 'error' | undefined} message={warrantyMessage} />
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
            {/* Optional: Add a subtle background to the header row for better visual separation */}
            <TableRow className="bg-muted/50 hover:bg-muted/60"> 
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* --- STRIPED TABLE LOGIC APPLIED HERE --- */}
            {assets.map((asset, index) => (
              <TableRow 
                key={asset.id} 
                className={index % 2 === 1 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-accent/50'} // Apply background to odd rows (1, 3, 5...)
              >
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.category_name}</TableCell>
                <TableCell>{asset.department_name}</TableCell>
                <TableCell>
                  {asset.purchase_date
                    ? new Date(asset.purchase_date as any).toLocaleDateString()
                    : ''}
                </TableCell>
                <TableCell>{asset.cost}</TableCell>
                <TableCell>{asset.created_by_name}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/dashboard/admin/assets/${asset.id}`}>
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
            {/* --- END OF STRIPED TABLE LOGIC --- */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}