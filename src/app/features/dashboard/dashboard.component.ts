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
  today = new Date();

  chartDonut: any;
  chartBarras: any;
  chartOpcionesBarras: any;
  chartOpcionesDonut: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.buildChartOptions();

    this.dashboardService.resumen().subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        this.buildCharts(d);
      },
      error: () => { this.loading = false; }
    });
  }

  private buildChartOptions(): void {
    const gridColor = 'rgba(255,255,255,0.05)';
    const tickColor = 'rgba(232,237,245,0.35)';
    const font = { family: 'Inter', size: 11 };

    this.chartOpcionesBarras = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#e8edf5',
          bodyColor: '#22c55e',
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          ticks: { color: tickColor, font },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          ticks: { color: tickColor, font, stepSize: 1 },
          grid: { color: gridColor },
          border: { display: false }
        }
      }
    };

    this.chartOpcionesDonut = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(232,237,245,0.6)',
            font,
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8
          }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#e8edf5',
          bodyColor: '#e8edf5',
          padding: 10,
          cornerRadius: 8
        }
      }
    };
  }

  private buildCharts(d: DashboardResumen): void {
    this.chartDonut = {
      labels: ['Abiertos', 'En peritación', 'Resueltos', 'Denegados'],
      datasets: [{
        data: [d.abiertos, d.enPeritacion, d.resueltos, d.denegados],
        backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444'],
        borderColor: ['#1e3a8a', '#78350f', '#14532d', '#7f1d1d'],
        borderWidth: 1,
        hoverOffset: 8
      }]
    };

    const tipos = Object.keys(d.distribucionPorTipo);
    const valores = tipos.map(t => d.distribucionPorTipo[t]);
    this.chartBarras = {
      labels: tipos,
      datasets: [{
        label: 'Siniestros',
        data: valores,
        backgroundColor: [
          'rgba(34,197,94,0.3)',
          'rgba(59,130,246,0.3)',
          'rgba(168,85,247,0.3)',
          'rgba(20,184,166,0.3)'
        ],
        borderColor: [
          'rgba(34,197,94,0.8)',
          'rgba(59,130,246,0.8)',
          'rgba(168,85,247,0.8)',
          'rgba(20,184,166,0.8)'
        ],
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false
      }]
    };
  }

  get totalSiniestros(): number {
    if (!this.data) return 0;
    return this.data.abiertos + this.data.enPeritacion + this.data.resueltos + this.data.denegados;
  }

  pct(val: number): number {
    const total = this.totalSiniestros;
    return total > 0 ? Math.round((val / total) * 100) : 0;
  }

  severidad(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = {
      ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger'
    };
    return map[estado];
  }

  etiqueta(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }
}
