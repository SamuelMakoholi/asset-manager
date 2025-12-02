import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchCategories } from '@/app/lib/data';
import { deleteCategory } from '@/app/lib/actions';

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Categories 🏷️</CardTitle>
        <CardDescription>Manage your asset categories, defining types like "Laptops," "Vehicles," or "Office Equipment."</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/admin/categories/create">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Category
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
            {categories.map((category, index) => (
              <TableRow 
                key={category.id} 
                // Apply background to odd rows (index 1, 3, 5...)
                className={index % 2 === 1 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-accent/50'} 
              >
                <TableCell className="font-semibold text-primary/90">{category.name}</TableCell>
                {/* Clamp the description text to two lines */}
                <TableCell className="max-w-xs truncate text-sm text-gray-600">{category.description}</TableCell> 
                <TableCell className="text-sm text-gray-500">{category.created_by_name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/admin/categories/${category.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server';
                      await deleteCategory(category.id);
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