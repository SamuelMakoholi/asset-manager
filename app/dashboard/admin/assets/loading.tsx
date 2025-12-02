import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAssetsLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mt-2 h-4 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
