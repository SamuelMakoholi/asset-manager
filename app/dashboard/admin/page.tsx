import { fetchAssetStats } from '@/app/lib/data';
import { fetchWarrantyList } from '@/app/lib/actions';

import { getCurrentUser } from '@/app/lib/server-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/app/lib/utils';
// --- Add Icon Imports ---
import { HardHat, DollarSign, Users, LayoutDashboard, ShieldCheck } from 'lucide-react'; 
// --- End Icon Imports ---

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const stats = await fetchAssetStats(null, true);

  // Fetch warranty list from external API to compute how many assets have registered warranties
  let warrantyAssetCount = 0;
  try {
    const warrantyList = await fetchWarrantyList();
    if (Array.isArray(warrantyList)) {
      warrantyAssetCount = warrantyList.length;
    } else if (Array.isArray((warrantyList as any)?.results)) {
      warrantyAssetCount = (warrantyList as any).results.length;
    }
  } catch (error) {
    console.error('Failed to fetch warranty list for admin dashboard:', error);
  }

  // Helper component for enhanced metric cards (using the existing stats)
  const MetricCard = ({ title, value, icon: Icon }: {
    title: string;
    value: string;
    icon: React.ElementType;
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        {/* Make the value prominent */}
        <div className="text-4xl font-extrabold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">
            View full reports
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* --- Main Dashboard Header --- */}
      <header className="flex items-center space-x-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Asset Overview
        </h1>
      </header>

      {/* --- Key Metrics (Total Assets, Value, and Warranty Count) --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* We only have two original metrics, so we'll use a 2-column layout for them */}
        <MetricCard 
          title="Total Assets" 
          value={stats.total_assets.toString()} 
          icon={HardHat} 
        />
        <MetricCard 
          title="Total Asset Value" 
          value={formatCurrency(stats.total_value)} 
          icon={DollarSign} 
        />
        <MetricCard
          title="Assets with Warranty"
          value={warrantyAssetCount.toString()}
          icon={ShieldCheck}
        />
        {/* Summary card using existing stats */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Asset Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Departments with assets
                </span>
              </div>
              <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {stats.assets_by_department.length}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Categories with assets
                </span>
              </div>
              <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {stats.assets_by_category.length}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recently added assets
                </span>
              </div>
              <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {stats.recent_assets.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Detailed Data Tables --- */}
      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Assets by Department (Span 2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
                <Users className="h-5 w-5 text-gray-500" />
                <span>Assets by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="text-right font-semibold">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.assets_by_department.map((row, index) => (
                  <TableRow key={row.department_name} className={index % 2 === 0 ? 'hover:bg-accent/30' : 'bg-muted/10 hover:bg-accent/30'}>
                    <TableCell className="font-medium">{row.department_name}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{row.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Assets (Span 3 Columns) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">
                Recent Assets
            </CardTitle>
            <p className="text-sm text-muted-foreground">Newly acquired or assigned assets.</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="text-right font-semibold">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recent_assets.map((asset, index) => (
                  <TableRow key={asset.id} className={index % 2 === 0 ? 'hover:bg-accent/30' : 'bg-muted/10 hover:bg-accent/30'}>
                    <TableCell className="font-semibold text-primary/80">{asset.name}</TableCell>
                    <TableCell className="text-sm text-gray-500">{asset.category_name}</TableCell>
                    <TableCell className="text-sm text-gray-500">{asset.department_name}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(asset.cost)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}