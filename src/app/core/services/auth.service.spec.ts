import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const mockResponse: AuthResponse = {
    accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.fake',
    refreshToken: 'refresh-token',
    username: 'admin',
    nombre: 'Administrador',
    rol: 'ADMIN'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  // ── login() ────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('debería llamar al endpoint correcto y almacenar el token', () => {
      service.login('admin', 'password123').subscribe(res => {
        expect(res.username).toBe('admin');
      });

      const req = http.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'admin', password: 'password123' });
      req.flush(mockResponse);

      expect(localStorage.getItem('access_token')).toBe(mockResponse.accessToken);
      expect(localStorage.getItem('auth_user')).toContain('admin');
    });
  });

  // ── logout() ───────────────────────────────────────────────────────────────

  describe('logout()', () => {
    it('debería limpiar el localStorage', () => {
      localStorage.setItem('access_token', 'tok');
      localStorage.setItem('auth_user', '{}');

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('debería emitir null en currentUser$', () => {
      let emitted: AuthResponse | null = mockResponse as AuthResponse;
      service.currentUser$.subscribe(u => emitted = u);

      service.logout();

      expect(emitted).toBeNull();
    });
  });

  // ── isLoggedIn() ───────────────────────────────────────────────────────────

  describe('isLoggedIn()', () => {
    it('debería devolver false cuando no hay token', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('debería devolver false con token expirado', () => {
      // Payload con exp en el pasado (año 2000)
      const expiredToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6OTQ2Njg0ODAwfQ.fake';
      localStorage.setItem('access_token', expiredToken);
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('debería devolver true con token válido (exp en el futuro)', () => {
      // Payload con exp = 9999999999 (año 2286)
      const validToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.fake';
      localStorage.setItem('access_token', validToken);
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  // ── getRole() ──────────────────────────────────────────────────────────────

  describe('getRole()', () => {
    it('debería devolver null cuando no hay usuario', () => {
      expect(service.getRole()).toBeNull();
    });

    it('debería devolver el rol del usuario autenticado', () => {
      service.login('admin', 'pass').subscribe();
      http.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);

      expect(service.getRole()).toBe('ADMIN');
    });
  });

  // ── hasRole() ──────────────────────────────────────────────────────────────

  describe('hasRole()', () => {
    beforeEach(() => {
      service.login('admin', 'pass').subscribe();
      http.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    });

    it('debería devolver true si el usuario tiene el rol', () => {
      expect(service.hasRole('ADMIN')).toBeTrue();
      expect(service.hasRole('GESTOR', 'ADMIN')).toBeTrue();
    });

    it('debería devolver false si el usuario no tiene el rol', () => {
      expect(service.hasRole('PERITO')).toBeFalse();
      expect(service.hasRole('GESTOR')).toBeFalse();
    });
  });
});
