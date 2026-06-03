import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResumen } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: DashboardResumen | null = null;
  loading = true;

  chartDonut: any;
  chartBarras: any;
  chartOpciones: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.resumen().subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.buildCharts(d);
      },
      error: () => { this.loading = false; }
    });

    this.chartOpciones = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: 'rgba(240,244,248,0.7)', font: { family: 'Inter', size: 12 } }
        }
      },
      scales: {
        x: {
          ticks: { color: 'rgba(240,244,248,0.5)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: { color: 'rgba(240,244,248,0.5)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(255,255,255,0.06)' }
        }
      }
    };
  }

  private buildCharts(d: DashboardResumen): void {
    // Donut — distribución por estado
    this.chartDonut = {
      labels: ['Abiertos', 'En peritación', 'Resueltos', 'Denegados'],
      datasets: [{
        data: [d.abiertos, d.enPeritacion, d.resueltos, d.denegados],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 6
      }]
    };

    // Barras — distribución por tipo de póliza
    const tipos = Object.keys(d.distribucionPorTipo);
    const valores = tipos.map(t => d.distribucionPorTipo[t]);
    this.chartBarras = {
      labels: tipos,
      datasets: [{
        label: 'Siniestros',
        data: valores,
        backgroundColor: 'rgba(34, 197, 94, 0.25)',
        borderColor: 'rgba(34, 197, 94, 0.8)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }]
    };
  }

  get totalSiniestros(): number {
    if (!this.data) return 0;
    return this.data.abiertos + this.data.enPeritacion + this.data.resueltos + this.data.denegados;
  }

  severidad(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = {
      ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger'
    };
    return map[estado];
  }

  etiqueta(estado: string): string {
    const map: Record<string, string> = {
      ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado'
    };
    return map[estado] ?? estado;
  }
}
