import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Un 401 en el propio login son credenciales incorrectas: lo gestiona el componente,
        // no debe disparar el logout/redirección global.
        const esEndpointAuth = req.url.includes('/auth/');
        if (err.status === 401 && !esEndpointAuth) {
          this.auth.logout();
        }
        const message = err.error?.message || 'Error inesperado';
        return throwError(() => ({ status: err.status, message }));
      })
    );
  }
}
