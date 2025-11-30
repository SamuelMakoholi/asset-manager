// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type Category = {
  id: string;
  name: string;
  description: string;
  created_by: string; // user_id
  created_at: string;
  created_by_name?: string;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  created_by: string; // user_id
  created_at: string;
  created_by_name?: string;
};

export type Asset = {
  id: string;
  name: string;
  category_id: string;
  department_id: string;
  purchase_date: string;
  cost: number;
  created_by: string; // user_id
  created_at: string;
  status: 'active' | 'disposed' | 'maintenance';
  notes?: string;
};

// For displaying assets with related information
export type AssetWithDetails = {
  id: string;
  name: string;
  category_name: string;
  department_name: string;
  purchase_date: string;
  cost: number;
  created_by_name: string;
  created_at: string;
  status: 'active' | 'disposed' | 'maintenance';
  notes?: string;
  created_by_name?: string;
};

// For dashboard statistics
export type AssetStats = {
  total_assets: number;
  total_value: number;
  assets_by_department: {
    department_name: string;
    count: number;
  }[];
  assets_by_category: {
    category_name: string;
    count: number;
  }[];
  recent_assets: {
    id: string;
    name: string;
    category_name: string;
    department_name: string;
    purchase_date: string;
    cost: number;
  }[];
};

// Form types
export type CategoryForm = {
  id?: string;
  name: string;
  description: string;
};

export type DepartmentForm = {
  id?: string;
  name: string;
  description: string;
};

export type AssetForm = {
  id?: string;
  name: string;
  category_id: string;
  department_id: string;
  purchase_date: string;
  cost: number;
  status: 'active' | 'disposed' | 'maintenance';
  notes?: string;
};

export type UserForm = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
};

// For select fields
export type CategoryField = {
  id: string;
  name: string;
};

export type DepartmentField = {
  id: string;
  name: string;
};

export type UserField = {
  id: string;
  name: string;
  role: 'admin' | 'user';
};
