import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAssetWithDetails } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/server-auth';
import { registerAssetWarranty, fetchWarrantyList } from '@/app/lib/actions';
import { RegisterWarrantyButton } from './register-warranty-button';

export default async function AssetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ warranty?: string; message?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const id = resolvedParams.id;
  const asset = await fetchAssetWithDetails(id);
  if (!asset) {
    notFound();
  }

  // Check warranty list from external API
  let hasExternalWarranty = false;
  try {
    const warrantyList = await fetchWarrantyList();
    // Assuming the API returns a list/array of objects with asset_external_id
    if (Array.isArray(warrantyList)) {
      hasExternalWarranty = warrantyList.some((w: any) => w.asset_external_id === id);
    } else if (Array.isArray((warrantyList as any)?.results)) {
      hasExternalWarranty = (warrantyList as any).results.some((w: any) => w.asset_external_id === id);
    }
  } catch (error) {
    console.error('Failed to check external warranty list:', error);
  }

  const warrantyStatus = resolvedSearchParams?.warranty;
  const warrantyMessage = resolvedSearchParams?.message
    ? decodeURIComponent(resolvedSearchParams.message)
    : undefined;
  const warrantyRegistered = warrantyStatus === 'success' || hasExternalWarranty;

  async function registerWarranty() {
    'use server';
    const ownerName = user?.name ?? 'Unknown';
    const redirectPath = user?.role === 'admin'
      ? '/dashboard/admin/assets'
      : `/dashboard/assets/${id}`;
    console.log('Registering warranty for asset:', {
      external_id: id,
      name: asset.name,
      serial_number: 'N/A',
      owner: ownerName,
    });
    await registerAssetWarranty(id, ownerName, redirectPath);
  }

  const backHref = user?.role === 'admin'
    ? '/dashboard/admin/assets'
    : '/dashboard/assets';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Asset Details</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">View information for this asset and register its warranty.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={backHref} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assets</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {warrantyMessage && (
          <div
            className={
              warrantyRegistered
                ? 'rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800'
                : 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800'
            }
          >
            {warrantyMessage}
          </div>
        )}
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
          <div className="flex items-center gap-2">
            <span>{asset.status}</span>
            {warrantyRegistered && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 border border-green-200">
                Warranty Registered
              </span>
            )}
          </div>
        </div>
        {asset.notes && (
          <div>
            <p className="font-semibold">Notes:</p>
            <p>{asset.notes}</p>
          </div>
        )}
        <form action={registerWarranty} className="pt-4 flex justify-end">
          <RegisterWarrantyButton />
        </form>
      </CardContent>
    </Card>
  );
}
