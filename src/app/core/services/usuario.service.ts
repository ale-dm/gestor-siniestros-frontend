import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioResumen } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  constructor(private http: HttpClient) {}

  peritos(): Observable<UsuarioResumen[]> {
    return this.http.get<UsuarioResumen[]>(`${environment.apiUrl}/usuarios/peritos`);
  }
}
