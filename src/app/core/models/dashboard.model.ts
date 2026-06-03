import { SiniestroResumen } from './siniestro.model';

export interface DashboardResumen {
  abiertos: number;
  enPeritacion: number;
  resueltos: number;
  denegados: number;
  totalImporteIndemnizado: number;
  mediaDiasResolucion: number | null;
  distribucionPorTipo: Record<string, number>;
  ultimosAbiertos: SiniestroResumen[];
}
