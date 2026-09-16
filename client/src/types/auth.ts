export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export type Role = "owner" | "admin" | "manager" | "employee";

export interface LoginResponse {
  user: User;
  tenant: Tenant;
  role: Role;
  accessToken: string;
  refreshToken: string;
}