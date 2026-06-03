import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SiniestroService } from '../../../core/services/siniestro.service';
import { Siniestro, EstadoSiniestro } from '../../../core/models/siniestro.model';

@Component({
  selector: 'app-lista-siniestros',
  templateUrl: './lista-siniestros.component.html'
})
export class ListaSiniestrosComponent implements OnInit {

  siniestros: Siniestro[] = [];
  totalRecords = 0;
  loading = false;
  page = 0;
  size = 10;
  filtroEstado: EstadoSiniestro | null = null;

  estados = [
    { label: 'Todos', value: null },
    { label: 'Abierto', value: 'ABIERTO' },
    { label: 'En peritación', value: 'EN_PERITACION' },
    { label: 'Resuelto', value: 'RESUELTO' },
    { label: 'Denegado', value: 'DENEGADO' }
  ];

  constructor(private siniestroService: SiniestroService, private router: Router) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.siniestroService.listar(this.filtroEstado ?? undefined, undefined, this.page, this.size).subscribe({
      next: res => { this.siniestros = res.content; this.totalRecords = res.totalElements; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onPage(event: any): void { this.page = event.first / event.rows; this.size = event.rows; this.cargar(); }

  verDetalle(id: number): void { this.router.navigate(['/siniestros', id]); }

  severidad(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = { ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger' };
    return map[estado];
  }

  etiqueta(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }
}
