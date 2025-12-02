import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchDepartments } from '@/app/lib/data';
import { deleteDepartment } from '@/app/lib/actions';

export default async function DepartmentsPage() {
  const departments = await fetchDepartments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments 👥</CardTitle>
        <CardDescription>Manage your company departments, which are essential for grouping assets and users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/admin/departments/create">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Department
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            {/* Added background to header for better separation */}
            <TableRow className="bg-muted/50 hover:bg-muted/60"> 
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Created By</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* --- STRIPED ROW LOGIC APPLIED HERE --- */}
            {departments.map((department, index) => (
              <TableRow 
                key={department.id} 
                // Apply background to odd rows (index 1, 3, 5...)
                className={index % 2 === 1 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-accent/50'} 
              >
                <TableCell className="font-semibold text-primary/90">{department.name}</TableCell>
                {/* Clamp the description text to two lines */}
                <TableCell className="max-w-xs truncate text-sm text-gray-600">{department.description}</TableCell> 
                <TableCell className="text-sm text-gray-500">{department.created_by_name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/admin/departments/${department.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server';
                      await deleteDepartment(department.id);
                    }}>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* --- END OF STRIPED ROW LOGIC --- */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}