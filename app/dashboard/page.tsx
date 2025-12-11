import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick overview of your assets and warranty activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Assets</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View and manage the assets you have registered in the system.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/assets">Go to My Assets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Register Warranty</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">
              Open an asset and register its warranty with the external service.
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Tip: Use the <span className="font-semibold">View</span> action on an asset to access warranty options.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Asset</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Add a new asset to start tracking and managing it.
            </p>
            <Button asChild size="sm">
              <Link href="/dashboard/assets/create">Create Asset</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
