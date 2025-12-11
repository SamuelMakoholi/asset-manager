import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <CardDescription>Loading overview...</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
