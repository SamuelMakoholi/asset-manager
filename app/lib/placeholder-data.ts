export const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'password123',
    role: 'admin' as const,
  },
  {
    name: 'Regular User',
    email: 'user@gmail.com',
    password: 'password123',
    role: 'user' as const,
  },
];

export const categories = [
  {
    name: 'Electronics',
    description: 'Computers, laptops, tablets, and peripherals',
  },
  {
    name: 'Furniture',
    description: 'Desks, chairs, tables, and cabinets',
  },
  {
    name: 'Vehicles',
    description: 'Company cars, vans, and trucks',
  },
  {
    name: 'Software',
    description: 'Licenses and subscriptions',
  },
];

export const departments = [
  {
    name: 'IT',
    description: 'Information Technology department',
  },
  {
    name: 'HR',
    description: 'Human Resources department',
  },
  {
    name: 'Operations',
    description: 'Operations and Logistics',
  },
  {
    name: 'Finance',
    description: 'Finance and Accounting',
  },
];

export const assets = [
  {
    name: 'MacBook Pro 16"',
    purchase_date: '2024-01-15',
    cost: 2499.00,
    status: 'active' as const,
    notes: 'Assigned to Lead Developer',
    category_name: 'Electronics',
    department_name: 'IT',
  },
  {
    name: 'Dell XPS 15',
    purchase_date: '2023-11-20',
    cost: 1899.00,
    status: 'active' as const,
    notes: 'Assigned to Graphic Designer',
    category_name: 'Electronics',
    department_name: 'IT',
  },
  {
    name: 'Herman Miller Aeron',
    purchase_date: '2023-05-10',
    cost: 1200.00,
    status: 'active' as const,
    notes: 'Ergonomic chair for HR Manager',
    category_name: 'Furniture',
    department_name: 'HR',
  },
  {
    name: 'Toyota Sienna',
    purchase_date: '2022-08-01',
    cost: 35000.00,
    status: 'active' as const,
    notes: 'Delivery van',
    category_name: 'Vehicles',
    department_name: 'Operations',
  },
  {
    name: 'Adobe Creative Cloud',
    purchase_date: '2024-01-01',
    cost: 600.00,
    status: 'active' as const,
    notes: 'Annual subscription',
    category_name: 'Software',
    department_name: 'IT',
  },
];
