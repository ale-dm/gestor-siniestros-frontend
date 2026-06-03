export type Rol = 'ADMIN' | 'GESTOR' | 'PERITO';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  nombre: string;
  rol: Rol;
}

export interface UsuarioResumen {
  id: number;
  username: string;
  nombre: string;
  apellidos: string;
  rol: Rol;
}
