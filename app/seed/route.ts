import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, categories, departments, assets } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password, role)
        SELECT ${user.name}, ${user.email}, ${hashedPassword}, ${user.role}
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ${user.email})
      `;
    }),
  );

  return insertedUsers;
}

async function seedCategories() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // Get the admin user to assign as creator
  // Note: Update this to match the email in placeholder-data.ts if it changed
  const adminUser = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
  const adminId = adminUser[0]?.id;

  if (!adminId) return;

  const insertedCategories = await Promise.all(
    categories.map(
      (category) => sql`
        INSERT INTO categories (name, description, created_by)
        SELECT ${category.name}, ${category.description}, ${adminId}
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = ${category.name})
      `,
    ),
  );

  return insertedCategories;
}

async function seedDepartments() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS departments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // Get the admin user to assign as creator
  const adminUser = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
  const adminId = adminUser[0]?.id;

  if (!adminId) return;

  const insertedDepartments = await Promise.all(
    departments.map(
      (department) => sql`
        INSERT INTO departments (name, description, created_by)
        SELECT ${department.name}, ${department.description}, ${adminId}
        WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = ${department.name})
      `,
    ),
  );

  return insertedDepartments;
}

async function seedAssets() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS assets (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category_id UUID REFERENCES categories(id),
      department_id UUID REFERENCES departments(id),
      purchase_date DATE NOT NULL,
      cost DECIMAL(10, 2) NOT NULL,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'disposed', 'maintenance')),
      notes TEXT
    );
  `;

  // Get the admin user to assign as creator
  const adminUser = await sql`SELECT id FROM users WHERE email = 'admin@assetmanager.com' LIMIT 1`;
  const adminId = adminUser[0]?.id;

  if (!adminId) return;

  // We need to map names to IDs for categories and departments
  const dbCategories = await sql`SELECT id, name FROM categories`;
  const dbDepartments = await sql`SELECT id, name FROM departments`;

  const catMap = new Map(dbCategories.map(c => [c.name, c.id]));
  const deptMap = new Map(dbDepartments.map(d => [d.name, d.id]));

  const insertedAssets = await Promise.all(
    assets.map((asset) => {
      const categoryId = catMap.get(asset.category_name);
      const departmentId = deptMap.get(asset.department_name);

      if (!categoryId || !departmentId) {
        console.warn(`Skipping asset ${asset.name}: Category or Department not found`);
        return null;
      }

      return sql`
        INSERT INTO assets (name, category_id, department_id, purchase_date, cost, created_by, status, notes)
        VALUES (
          ${asset.name}, 
          ${categoryId}, 
          ${departmentId}, 
          ${asset.purchase_date}, 
          ${asset.cost}, 
          ${adminId}, 
          ${asset.status}, 
          ${asset.notes}
        )
      `;
    }),
  );

  return insertedAssets;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedCategories();
      await seedDepartments();
      await seedAssets();
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      error: 'Failed to seed database', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
