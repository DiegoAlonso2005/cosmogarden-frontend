export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  total: number;
  createdAt?: string;
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
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface CreateSalePayload {
  productId: string;
  quantity: number;
  total: number;
}
