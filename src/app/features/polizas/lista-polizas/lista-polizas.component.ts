import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../core/services/toast.service';
import { PolizaService } from '../../../core/services/poliza.service';
import { Poliza, EstadoPoliza, TipoPoliza } from '../../../core/models/poliza.model';

@Component({
  selector: 'app-lista-polizas',
  templateUrl: './lista-polizas.component.html'
})
export class ListaPolizasComponent implements OnInit {

  polizas: Poliza[] = [];
  totalRecords = 0;
  loading = false;
  page = 0;
  size = 10;
  filtroEstado: EstadoPoliza | null = null;
  filtroTipo: TipoPoliza | null = null;

  estados = [
    { label: 'Todos', value: null },
    { label: 'Activa', value: 'ACTIVA' },
    { label: 'Suspendida', value: 'SUSPENDIDA' },
    { label: 'Cancelada', value: 'CANCELADA' }
  ];

  tipos = [
    { label: 'Todos', value: null },
    { label: 'Hogar', value: 'HOGAR' },
    { label: 'Auto', value: 'AUTO' },
    { label: 'Vida', value: 'VIDA' },
    { label: 'Salud', value: 'SALUD' }
  ];

  constructor(
    private polizaService: PolizaService,
    private confirmationService: ConfirmationService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.polizaService.listar(this.filtroEstado ?? undefined, this.filtroTipo ?? undefined, this.page, this.size).subscribe({
      next: res => { this.polizas = res.content; this.totalRecords = res.totalElements; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onPage(event: any): void {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.cargar();
  }

  editar(id: number): void { this.router.navigate(['/polizas', id, 'editar']); }

  cambiarEstado(poliza: Poliza, nuevoEstado: EstadoPoliza): void {
    this.polizaService.cambiarEstado(poliza.id, nuevoEstado).subscribe({
      next: () => { this.toast.success(`Póliza ${nuevoEstado.toLowerCase()}`); this.cargar(); },
      error: err => this.toast.error(err.message)
    });
  }

  severidadEstado(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'warn' | 'danger'> = { ACTIVA: 'success', SUSPENDIDA: 'warn', CANCELADA: 'danger' };
    return map[estado];
  }
}
