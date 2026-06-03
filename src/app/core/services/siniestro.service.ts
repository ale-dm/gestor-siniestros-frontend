import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Siniestro, SiniestroRequest, CambioEstadoRequest, AsignarPeritoRequest, LogSiniestro } from '../models/siniestro.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class SiniestroService {

  private url = `${environment.apiUrl}/siniestros`;

  constructor(private http: HttpClient) {}

  listar(estado?: string, peritoId?: number, page = 0, size = 10): Observable<PageResponse<Siniestro>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (estado) params = params.set('estado', estado);
    if (peritoId) params = params.set('peritoId', peritoId);
    return this.http.get<PageResponse<Siniestro>>(this.url, { params });
  }

  obtener(id: number): Observable<Siniestro> {
    return this.http.get<Siniestro>(`${this.url}/${id}`);
  }

  crear(data: SiniestroRequest): Observable<Siniestro> {
    return this.http.post<Siniestro>(this.url, data);
  }

  cambiarEstado(id: number, data: CambioEstadoRequest): Observable<Siniestro> {
    return this.http.patch<Siniestro>(`${this.url}/${id}/estado`, data);
  }

  asignarPerito(id: number, data: AsignarPeritoRequest): Observable<Siniestro> {
    return this.http.patch<Siniestro>(`${this.url}/${id}/asignar-perito`, data);
  }

  obtenerLog(id: number): Observable<LogSiniestro[]> {
    return this.http.get<LogSiniestro[]>(`${this.url}/${id}/log`);
  }
}
