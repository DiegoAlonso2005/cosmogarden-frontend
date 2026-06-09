export interface Product {
  id: number | string;
  code?: string;
  name?: string;
  species?: string;
  category?: string;
  location?: string;
  price?: number;
  stock?: number;
  health?: string;
  watered?: string;
  image?: string;
}

export interface Sale {
  id: number | string;
  code?: string;
  client?: string;
  date?: string;
  total?: number;
  payment?: string;
  status?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateProductPayload {
  code?: string;
  name: string;
  species?: string;
  category?: string;
  location?: string;
  price: number;
  stock: number;
  health?: string;
  watered?: string;
  image?: string;
}

export interface CreateSalePayload {
  code: string;
  client: string;
  total: number;
  payment: string;
  status: string;
}
