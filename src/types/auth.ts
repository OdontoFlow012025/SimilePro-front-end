export type Role = 'ADMIN' | 'DENTIST' | 'SECRETARY';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clinicId?: string;
  avatarUrl?: string;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role?: Role; // Keeping for backward compatibility if needed
  tipoUsuario?: string; // New field from backend (e.g., ADMIN_TOTAL)
  name: string;
  exp: number;
  iat: number;
  clinicId?: string;
}
