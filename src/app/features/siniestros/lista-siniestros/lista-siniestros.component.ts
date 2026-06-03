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
  exportando = false;
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

  exportarCSV(): void {
    this.exportando = true;
    // Carga todos los siniestros con el filtro activo (hasta 1000)
    this.siniestroService.listar(this.filtroEstado ?? undefined, undefined, 0, 1000).subscribe({
      next: res => {
        const csv = this.generarCSV(res.content);
        this.descargarArchivo(csv, `siniestros_${new Date().toISOString().slice(0, 10)}.csv`);
        this.exportando = false;
      },
      error: () => { this.exportando = false; }
    });
  }

  private generarCSV(datos: Siniestro[]): string {
    const cabecera = [
      'Número', 'Estado', 'Póliza', 'Tipo', 'Perito',
      'Importe reclamado', 'Importe indemnizado', 'Fecha apertura', 'Fecha resolución'
    ].join(';');

    const filas = datos.map(s => [
      s.numeroSiniestro,
      this.etiqueta(s.estado),
      s.poliza?.numeroPoliza ?? '',
      s.poliza?.tipo ?? '',
      s.perito ? `${s.perito.nombre} ${s.perito.apellidos}` : '',
      s.importeReclamado?.toString().replace('.', ',') ?? '',
      s.importeIndemnizado?.toString().replace('.', ',') ?? '',
      s.fechaApertura ? new Date(s.fechaApertura).toLocaleDateString('es-ES') : '',
      s.fechaResolucion ? new Date(s.fechaResolucion).toLocaleDateString('es-ES') : ''
    ].join(';'));

    return '﻿' + [cabecera, ...filas].join('\n'); // BOM para que Excel abra bien
  }

  private descargarArchivo(contenido: string, nombreArchivo: string): void {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  severidad(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = { ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger' };
    return map[estado];
  }

  etiqueta(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }
}
