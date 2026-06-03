import { PolizaResumen } from './poliza.model';
import { UsuarioResumen } from './usuario.model';

export type EstadoSiniestro = 'ABIERTO' | 'EN_PERITACION' | 'RESUELTO' | 'DENEGADO';

export interface SiniestroResumen {
  id: number;
  numeroSiniestro: string;
  estado: EstadoSiniestro;
  fechaApertura: string;
  importeReclamado: number;
}

export interface Siniestro {
  id: number;
  numeroSiniestro: string;
  descripcion: string;
  estado: EstadoSiniestro;
  fechaApertura: string;
  fechaResolucion: string | null;
  importeReclamado: number;
  importeIndemnizado: number | null;
  observaciones: string | null;
  poliza: PolizaResumen;
  perito: UsuarioResumen | null;
  createdAt: string;
}

export interface SiniestroRequest {
  descripcion: string;
  importeReclamado?: number;
  polizaId: number;
}

export interface CambioEstadoRequest {
  estado: EstadoSiniestro;
  importeIndemnizado?: number;
  observaciones?: string;
}

export interface AsignarPeritoRequest {
  peritoId: number;
}

export interface LogSiniestro {
  id: number;
  estadoAnterior: EstadoSiniestro | null;
  estadoNuevo: EstadoSiniestro;
  observaciones: string | null;
  usuario: UsuarioResumen | null;
  fecha: string;
}
