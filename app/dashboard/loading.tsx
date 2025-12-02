import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-2">
            <CardTitle>
              <Skeleton className="h-5 w-28" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-40" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
