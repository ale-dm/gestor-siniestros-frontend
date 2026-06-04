import { ClienteResumen } from './cliente.model';
import { PolizaResumen } from './poliza.model';
import { SiniestroResumen } from './siniestro.model';

export interface SearchResponse {
  clientes: ClienteResumen[];
  polizas: PolizaResumen[];
  siniestros: SiniestroResumen[];
}

export type SearchResultType = 'cliente' | 'poliza' | 'siniestro';

export interface SearchResult {
  type: SearchResultType;
  id: number;
  label: string;
  sublabel: string;
  route: string[];
}
