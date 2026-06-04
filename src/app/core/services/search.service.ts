import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchResponse } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  buscar(q: string): Observable<SearchResponse> {
    const params = new HttpParams().set('q', q);
    return this.http.get<SearchResponse>(`${environment.apiUrl}/search`, { params });
  }
}
