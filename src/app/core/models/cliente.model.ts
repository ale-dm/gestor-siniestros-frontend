import { PolizaResumen } from './poliza.model';

export interface ClienteResumen {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  polizasActivas: PolizaResumen[];
  createdAt: string;
}

export interface ClienteRequest {
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
}
