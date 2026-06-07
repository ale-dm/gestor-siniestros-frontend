import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  // Peticiones que no deben mostrar la barra de progreso global (p. ej. el buscador con debounce).
  private readonly silenciadas = ['/search'];

  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.silenciadas.some(url => req.url.includes(url))) {
      return next.handle(req);
    }
    this.loading.show();
    return next.handle(req).pipe(finalize(() => this.loading.hide()));
  }
}
