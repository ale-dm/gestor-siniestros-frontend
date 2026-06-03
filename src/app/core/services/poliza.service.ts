import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Poliza, PolizaRequest } from '../models/poliza.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class PolizaService {

  private url = `${environment.apiUrl}/polizas`;

  constructor(private http: HttpClient) {}

  listar(estado?: string, tipo?: string, page = 0, size = 10): Observable<PageResponse<Poliza>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (estado) params = params.set('estado', estado);
    if (tipo) params = params.set('tipo', tipo);
    return this.http.get<PageResponse<Poliza>>(this.url, { params });
  }

  obtener(id: number): Observable<Poliza> {
    return this.http.get<Poliza>(`${this.url}/${id}`);
  }

  crear(data: PolizaRequest): Observable<Poliza> {
    return this.http.post<Poliza>(this.url, data);
  }

  actualizar(id: number, data: PolizaRequest): Observable<Poliza> {
    return this.http.put<Poliza>(`${this.url}/${id}`, data);
  }

  cambiarEstado(id: number, estado: string): Observable<Poliza> {
    return this.http.patch<Poliza>(`${this.url}/${id}/estado`, { estado });
  }
}
