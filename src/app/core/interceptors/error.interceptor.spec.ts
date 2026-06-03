import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    localStorage.setItem('access_token', 'tok');
    localStorage.setItem('auth_user', JSON.stringify({ username: 'admin', rol: 'ADMIN' }));
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería llamar a logout() cuando el servidor devuelve 401', () => {
    spyOn(authService, 'logout');

    http.get('/api/protegido').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/protegido');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.logout).toHaveBeenCalled();
  });

  it('NO debería llamar a logout() en errores 422', () => {
    spyOn(authService, 'logout');

    http.get('/api/recurso').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/recurso');
    req.flush({ message: 'Error de negocio' }, { status: 422, statusText: 'Unprocessable Entity' });

    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('debería propagar el mensaje de error del servidor', () => {
    let errorCapturado: any;

    http.get('/api/recurso').subscribe({ error: err => errorCapturado = err });

    const req = httpMock.expectOne('/api/recurso');
    req.flush({ message: 'DNI duplicado' }, { status: 422, statusText: 'Unprocessable Entity' });

    expect(errorCapturado.message).toBe('DNI duplicado');
  });
});
