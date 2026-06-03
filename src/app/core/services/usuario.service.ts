import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioRequest, UsuarioResumen } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  peritos(): Observable<UsuarioResumen[]> {
    return this.http.get<UsuarioResumen[]>(`${this.url}/peritos`);
  }

  crear(data: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, data);
  }

  activar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/activar`, {});
  }

  desactivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/desactivar`, {});
  }
}
