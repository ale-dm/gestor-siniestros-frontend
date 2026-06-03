import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteRequest } from '../models/cliente.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private url = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar(search = '', page = 0, size = 10): Observable<PageResponse<Cliente>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<Cliente>>(this.url, { params });
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  crear(data: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, data);
  }

  actualizar(id: number, data: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, data);
  }

  desactivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/desactivar`, {});
  }
}
