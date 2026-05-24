export interface User {
  id: number;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  roles: string[];
}

export interface UserRoleDto {
  userId: number;
  userEmail: string;
  userDisplayName: string;
  roles: string[];
}

export interface AssignRoleDto {
  userId: number;
  roleId: number;
}
