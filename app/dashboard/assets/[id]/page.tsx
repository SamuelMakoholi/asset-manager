import { redirect, notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAssetWithDetails } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/server-auth';
import { registerAssetWarranty } from '@/app/lib/actions';

export default async function AssetDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { warranty?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const id = params.id;
  const asset = await fetchAssetWithDetails(id);

  if (!asset) {
    notFound();
  }

  const warrantyRegistered = searchParams?.warranty === 'success';

  async function registerWarranty() {
    'use server';
    await registerAssetWarranty(id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{asset.name}</p>
        </div>
        <div>
          <p className="font-semibold">Category:</p>
          <p>{asset.category_name}</p>
        </div>
        <div>
          <p className="font-semibold">Department:</p>
          <p>{asset.department_name}</p>
        </div>
        <div>
          <p className="font-semibold">Purchase Date:</p>
          <p>{asset.purchase_date ? new Date(asset.purchase_date as any).toLocaleDateString() : ''}</p>
        </div>
        <div>
          <p className="font-semibold">Cost:</p>
          <p>{asset.cost}</p>
        </div>
        <div>
          <p className="font-semibold">Status:</p>
          <p>
            {asset.status}
            {warrantyRegistered && ' (Warranty Registered)'}
          </p>
        </div>
        {asset.notes && (
          <div>
            <p className="font-semibold">Notes:</p>
            <p>{asset.notes}</p>
          </div>
        )}
        <form action={registerWarranty} className="pt-4">
          <Button type="submit">Register Warranty</Button>
        </form>
      </CardContent>
    </Card>
  );
}
