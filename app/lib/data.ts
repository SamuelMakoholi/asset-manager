import postgres from 'postgres';
import {
  User,
  Category,
  Department,
  Asset,
  AssetWithDetails,
  AssetStats,
  CategoryField,
  DepartmentField,
  UserField,
} from './definitions';
import { formatCurrency } from './utils';

// This would normally come from an environment variable
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// User functions
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE id=${id}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchUsers() {
  try {
    const users = await sql<User[]>`
      SELECT id, name, email, role FROM users
      ORDER BY name ASC
    `;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchUserFields() {
  try {
    const users = await sql<UserField[]>`
      SELECT id, name, role FROM users
      ORDER BY name ASC
    `;
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user fields.');
  }
}

// Category functions
export async function fetchCategories() {
  try {
    const categories = await sql<Category[]>`
      SELECT c.*, u.name as created_by_name
      FROM categories c
      JOIN users u ON c.created_by = u.id
      ORDER BY c.name ASC
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchCategoryById(id: string) {
  try {
    const category = await sql<Category[]>`
      SELECT * FROM categories WHERE id=${id}
    `;
    return category[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category.');
  }
}

export async function fetchCategoryFields() {
  try {
    const categories = await sql<CategoryField[]>`
      SELECT id, name FROM categories
      ORDER BY name ASC
    `;
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch category fields.');
  }
}

// Department functions
export async function fetchDepartments() {
  try {
    const departments = await sql<Department[]>`
      SELECT d.*, u.name as created_by_name
      FROM departments d
      JOIN users u ON d.created_by = u.id
      ORDER BY d.name ASC
    `;
    return departments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch departments.');
  }
}

export async function fetchDepartmentById(id: string) {
  try {
    const department = await sql<Department[]>`
      SELECT * FROM departments WHERE id=${id}
    `;
    return department[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch department.');
  }
}

export async function fetchDepartmentFields() {
  try {
    const departments = await sql<DepartmentField[]>`
      SELECT id, name FROM departments
      ORDER BY name ASC
    `;
    return departments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch department fields.');
  }
}

// Asset functions
export async function fetchAssetById(id: string) {
  try {
    const asset = await sql<Asset[]>`
      SELECT * FROM assets WHERE id=${id}
    `;
    return asset[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch asset.');
  }
}

export async function fetchAssetWithDetails(id: string) {
  try {
    const asset = await sql<AssetWithDetails[]>`
      SELECT 
        a.id,
        a.name,
        c.name as category_name,
        d.name as department_name,
        a.purchase_date,
        a.cost,
        u.name as created_by_name,
        a.created_at,
        a.status,
        a.notes
      FROM assets a
      JOIN categories c ON a.category_id = c.id
      JOIN departments d ON a.department_id = d.id
      JOIN users u ON a.created_by = u.id
      WHERE a.id = ${id}
    `;
    return asset[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch asset details.');
  }
}

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredAssets(
  query: string,
  currentPage: number,
  userId: string | null = null,
  isAdmin: boolean = false
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // If user is admin, they can see all assets
    // If not, they can only see assets they created
    const assets = isAdmin
      ? await sql`
          SELECT 
            a.id,
            a.name,
            c.name as category_name,
            d.name as department_name,
            a.purchase_date,
            a.cost,
            u.name as created_by_name,
            a.status
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          JOIN users u ON a.created_by = u.id
          WHERE
            a.name ILIKE ${`%${query}%`} OR
            c.name ILIKE ${`%${query}%`} OR
            d.name ILIKE ${`%${query}%`} OR
            a.status ILIKE ${`%${query}%`}
          ORDER BY a.created_at DESC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `
      : await sql`
          SELECT 
            a.id,
            a.name,
            c.name as category_name,
            d.name as department_name,
            a.purchase_date,
            a.cost,
            u.name as created_by_name,
            a.status
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          JOIN users u ON a.created_by = u.id
          WHERE a.created_by = ${userId} AND (
            a.name ILIKE ${`%${query}%`} OR
            c.name ILIKE ${`%${query}%`} OR
            d.name ILIKE ${`%${query}%`} OR
            a.status ILIKE ${`%${query}%`}
          )
          ORDER BY a.created_at DESC
          LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;

    return assets;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch assets.');
  }
}

export async function fetchAssetsPages(
  query: string,
  userId: string | null = null,
  isAdmin: boolean = false
) {
  try {
    const count = isAdmin
      ? await sql`
          SELECT COUNT(*)
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          WHERE
            a.name ILIKE ${`%${query}%`} OR
            c.name ILIKE ${`%${query}%`} OR
            d.name ILIKE ${`%${query}%`} OR
            a.status ILIKE ${`%${query}%`}
        `
      : await sql`
          SELECT COUNT(*)
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          WHERE a.created_by = ${userId} AND (
            a.name ILIKE ${`%${query}%`} OR
            c.name ILIKE ${`%${query}%`} OR
            d.name ILIKE ${`%${query}%`} OR
            a.status ILIKE ${`%${query}%`}
          )
        `;

    const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of assets.');
  }
}

// Dashboard statistics
export async function fetchAssetStats(userId: string | null = null, isAdmin: boolean = false) {
  try {
    // Total assets and value
    const totals = isAdmin
      ? await sql`
          SELECT 
            COUNT(*) as total_assets,
            SUM(cost) as total_value
          FROM assets
        `
      : await sql`
          SELECT 
            COUNT(*) as total_assets,
            SUM(cost) as total_value
          FROM assets
          WHERE created_by = ${userId}
        `;

    // Assets by department
    const byDepartment = isAdmin
      ? await sql`
          SELECT 
            d.name as department_name,
            COUNT(*) as count
          FROM assets a
          JOIN departments d ON a.department_id = d.id
          GROUP BY d.name
          ORDER BY count DESC
          LIMIT 5
        `
      : await sql`
          SELECT 
            d.name as department_name,
            COUNT(*) as count
          FROM assets a
          JOIN departments d ON a.department_id = d.id
          WHERE a.created_by = ${userId}
          GROUP BY d.name
          ORDER BY count DESC
          LIMIT 5
        `;

    // Assets by category
    const byCategory = isAdmin
      ? await sql`
          SELECT 
            c.name as category_name,
            COUNT(*) as count
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          GROUP BY c.name
          ORDER BY count DESC
          LIMIT 5
        `
      : await sql`
          SELECT 
            c.name as category_name,
            COUNT(*) as count
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          WHERE a.created_by = ${userId}
          GROUP BY c.name
          ORDER BY count DESC
          LIMIT 5
        `;

    // Recent assets
    const recentAssets = isAdmin
      ? await sql`
          SELECT 
            a.id,
            a.name,
            c.name as category_name,
            d.name as department_name,
            a.purchase_date,
            a.cost
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          ORDER BY a.created_at DESC
          LIMIT 5
        `
      : await sql`
          SELECT 
            a.id,
            a.name,
            c.name as category_name,
            d.name as department_name,
            a.purchase_date,
            a.cost
          FROM assets a
          JOIN categories c ON a.category_id = c.id
          JOIN departments d ON a.department_id = d.id
          WHERE a.created_by = ${userId}
          ORDER BY a.created_at DESC
          LIMIT 5
        `;

    const stats: AssetStats = {
      total_assets: Number(totals[0].total_assets ?? 0),
      total_value: Number(totals[0].total_value ?? 0),
      assets_by_department: byDepartment,
      assets_by_category: byCategory,
      recent_assets: recentAssets.map(asset => ({
        ...asset,
        cost: Number(asset.cost)
      }))
    };

    return stats;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch asset statistics.');
  }
}
