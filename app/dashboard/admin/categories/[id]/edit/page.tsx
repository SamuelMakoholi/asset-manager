import { updateCategory } from '@/app/lib/actions';
import { fetchCategoryById } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const category = await fetchCategoryById(id);

  if (!category) {
    notFound();
  }

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updateCategoryWithId} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={category.name} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={category.description} />
          </div>
          <Button type="submit" className="w-full">Update Category</Button>
        </form>
      </CardContent>
    </Card>
  );
}
