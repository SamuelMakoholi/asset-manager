'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { User, CategoryForm, DepartmentForm, AssetForm, UserForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Authentication
export async function authenticate(email: string, password: string) {
  try {
    await signIn('credentials', { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}

// User Management
export async function createUser(formData: FormData) {
  const validatedFields = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'user']),
  }).safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  const { name, email, password, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email=${email}`;
    if (existingUser.length > 0) {
      return {
        message: 'User with this email already exists.',
      };
    }

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}

export async function updateUser(id: string, formData: FormData) {
  const validatedFields = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().optional(),
    role: z.enum(['admin', 'user']),
  }).safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}, role = ${role}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, role = ${role}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update User.',
    };
  }

  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/users');
    return { message: 'User Deleted Successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete User.',
    };
  }
}

// Category Management
export async function createCategory(formData: FormData, userId: string) {
  const validatedFields = z.object({
    name: z.string().min(1),
    description: z.string(),
  }).safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  const { name, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO categories (name, description, created_by, created_at)
      VALUES (${name}, ${description}, ${userId}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Category.',
    };
  }

  revalidatePath('/dashboard/admin/categories');
  redirect('/dashboard/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const validatedFields = z.object({
    name: z.string().min(1),
    description: z.string(),
  }).safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await sql`
      UPDATE categories
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Category.',
    };
  }

  revalidatePath('/dashboard/admin/categories');
  redirect('/dashboard/admin/categories');
}

export async function deleteCategory(id: string) {
  try {
    // Check if category is in use
    const assets = await sql`SELECT * FROM assets WHERE category_id = ${id}`;
    if (assets.length > 0) {
      return {
        message: 'Cannot delete category that is in use by assets.',
      };
    }

    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/categories');
    return { message: 'Category Deleted Successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Category.',
    };
  }
}

// Department Management
export async function createDepartment(formData: FormData, userId: string) {
  const validatedFields = z.object({
    name: z.string().min(1),
    description: z.string(),
  }).safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Department.',
    };
  }

  const { name, description } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO departments (name, description, created_by, created_at)
      VALUES (${name}, ${description}, ${userId}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Department.',
    };
  }

  revalidatePath('/dashboard/admin/departments');
  redirect('/dashboard/admin/departments');
}

export async function updateDepartment(id: string, formData: FormData) {
  const validatedFields = z.object({
    name: z.string().min(1),
    description: z.string(),
  }).safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Department.',
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await sql`
      UPDATE departments
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Department.',
    };
  }

  revalidatePath('/dashboard/admin/departments');
  redirect('/dashboard/admin/departments');
}

export async function deleteDepartment(id: string) {
  try {
    // Check if department is in use
    const assets = await sql`SELECT * FROM assets WHERE department_id = ${id}`;
    if (assets.length > 0) {
      return {
        message: 'Cannot delete department that is in use by assets.',
      };
    }

    await sql`DELETE FROM departments WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/departments');
    return { message: 'Department Deleted Successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Department.',
    };
  }
}

// Asset Management
export async function createAsset(formData: FormData, userId: string) {
  const validatedFields = z.object({
    name: z.string().min(1),
    category_id: z.string().min(1),
    department_id: z.string().min(1),
    purchase_date: z.string().min(1),
    cost: z.coerce.number().positive(),
    status: z.enum(['active', 'disposed', 'maintenance']),
    notes: z.string().optional(),
  }).safeParse({
    name: formData.get('name'),
    category_id: formData.get('category_id'),
    department_id: formData.get('department_id'),
    purchase_date: formData.get('purchase_date'),
    cost: formData.get('cost'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Asset.',
    };
  }

  const { name, category_id, department_id, purchase_date, cost, status, notes } = validatedFields.data;
  const date = new Date().toISOString();

  try {
    await sql`
      INSERT INTO assets (name, category_id, department_id, purchase_date, cost, created_by, created_at, status, notes)
      VALUES (${name}, ${category_id}, ${department_id}, ${purchase_date}, ${cost}, ${userId}, ${date}, ${status}, ${notes || ''})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Asset.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateAsset(id: string, formData: FormData) {
  const validatedFields = z.object({
    name: z.string().min(1),
    category_id: z.string().min(1),
    department_id: z.string().min(1),
    purchase_date: z.string().min(1),
    cost: z.coerce.number().positive(),
    status: z.enum(['active', 'disposed', 'maintenance']),
    notes: z.string().optional(),
  }).safeParse({
    name: formData.get('name'),
    category_id: formData.get('category_id'),
    department_id: formData.get('department_id'),
    purchase_date: formData.get('purchase_date'),
    cost: formData.get('cost'),
    status: formData.get('status'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Asset.',
    };
  }

  const { name, category_id, department_id, purchase_date, cost, status, notes } = validatedFields.data;

  try {
    await sql`
      UPDATE assets
      SET name = ${name}, 
          category_id = ${category_id}, 
          department_id = ${department_id}, 
          purchase_date = ${purchase_date}, 
          cost = ${cost}, 
          status = ${status}, 
          notes = ${notes || ''}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Asset.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteAsset(id: string) {
  try {
    await sql`DELETE FROM assets WHERE id = ${id}`;
    revalidatePath('/dashboard');
    return { message: 'Asset Deleted Successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Asset.',
    };
  }
}
