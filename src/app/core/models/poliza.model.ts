import { ClienteResumen } from './cliente.model';
import { SiniestroResumen } from './siniestro.model';

export type TipoPoliza = 'HOGAR' | 'AUTO' | 'VIDA' | 'SALUD';
export type EstadoPoliza = 'ACTIVA' | 'SUSPENDIDA' | 'CANCELADA';

export interface PolizaResumen {
  id: number;
  numeroPoliza: string;
  tipo: TipoPoliza;
  estado: EstadoPoliza;
  fechaVencimiento: string;
  coberturaMaxima: number;
}

export interface Poliza {
  id: number;
  numeroPoliza: string;
  tipo: TipoPoliza;
  estado: EstadoPoliza;
  fechaInicio: string;
  fechaVencimiento: string;
  coberturaMaxima: number;
  primaMensual: number;
  descripcion: string;
  cliente: ClienteResumen;
  siniestros: SiniestroResumen[];
  createdAt: string;
}

export interface PolizaRequest {
  tipo: TipoPoliza;
  fechaInicio: string;
  fechaVencimiento: string;
  coberturaMaxima: number;
  primaMensual?: number;
  descripcion?: string;
  clienteId: number;
}
