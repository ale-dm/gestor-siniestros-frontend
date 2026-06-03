import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ListaClientesComponent } from './lista-clientes.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { PageResponse } from '../../../core/models/page.model';
import { Cliente } from '../../../core/models/cliente.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListaClientesComponent', () => {
  let component: ListaClientesComponent;
  let fixture: ComponentFixture<ListaClientesComponent>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const clientesMock: PageResponse<Cliente> = {
    content: [
      { id: 1, nombre: 'Ana', apellidos: 'González', dni: '12345678A',
        email: 'ana@test.com', telefono: '600111222', direccion: '', activo: true,
        polizasActivas: [], createdAt: '2026-01-01T00:00:00' },
      { id: 2, nombre: 'Miguel', apellidos: 'Fernández', dni: '87654321B',
        email: 'miguel@test.com', telefono: '600333444', direccion: '', activo: true,
        polizasActivas: [], createdAt: '2026-01-02T00:00:00' }
    ],
    page: 0, size: 10, totalElements: 2, totalPages: 1, last: true
  };

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['listar', 'desactivar']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    clienteServiceSpy.listar.and.returnValue(of(clientesMock));

    await TestBed.configureTestingModule({
      declarations: [ListaClientesComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        ConfirmationService
      ],
      schemas: [NO_ERRORS_SCHEMA]  // ignora componentes PrimeNG no registrados
    }).compileComponents();

    fixture = TestBed.createComponent(ListaClientesComponent);
    component = fixture.componentInstance;
  });

  // ── Inicialización ────────────────────────────────────────────────────────

  describe('ngOnInit()', () => {
    it('debería cargar clientes al iniciar', () => {
      fixture.detectChanges();

      expect(clienteServiceSpy.listar).toHaveBeenCalledWith('', 0, 10);
      expect(component.clientes.length).toBe(2);
      expect(component.totalRecords).toBe(2);
    });

    it('debería poner loading=false al completar la carga', () => {
      fixture.detectChanges();

      expect(component.loading).toBeFalse();
    });

    it('debería poner loading=false si el servicio falla', () => {
      clienteServiceSpy.listar.and.returnValue(throwError(() => ({ message: 'Error' })));

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
    });
  });

  // ── Búsqueda ──────────────────────────────────────────────────────────────

  describe('onSearch()', () => {
    it('debería reiniciar la página y buscar con el término dado', fakeAsync(() => {
      fixture.detectChanges();
      component.page = 2;

      component.onSearch('gonzalez');
      tick(400); // supera el debounceTime de 350ms

      expect(component.page).toBe(0);
      expect(clienteServiceSpy.listar).toHaveBeenCalledWith('gonzalez', 0, 10);
    }));
  });

  // ── Paginación ────────────────────────────────────────────────────────────

  describe('onPage()', () => {
    it('debería actualizar la página y recargar', () => {
      fixture.detectChanges();
      clienteServiceSpy.listar.calls.reset();

      component.onPage({ first: 10, rows: 10 });

      expect(component.page).toBe(1);
      expect(clienteServiceSpy.listar).toHaveBeenCalledWith('', 1, 10);
    });
  });

  // ── Estado ────────────────────────────────────────────────────────────────

  describe('estado inicial', () => {
    it('debería inicializar con valores por defecto correctos', () => {
      expect(component.page).toBe(0);
      expect(component.size).toBe(10);
      expect(component.search).toBe('');
      expect(component.loading).toBeFalse();
    });
  });
});
