import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClienteService } from '../../../core/services/cliente.service';
import { PolizaService } from '../../../core/services/poliza.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Poliza } from '../../../core/models/poliza.model';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss']
})
export class DetalleClienteComponent implements OnInit {

  cliente: Cliente | null = null;
  polizas: Poliza[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private polizaService: PolizaService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.cargar(id);
  }

  cargar(id: number): void {
    this.loading = true;
    this.clienteService.obtener(id).subscribe({
      next: cliente => {
        this.cliente = cliente;

        if (cliente.polizasActivas.length === 0) {
          this.loading = false;
          return;
        }

        // Carga en paralelo el detalle de cada póliza activa (incluye siniestros)
        const requests = cliente.polizasActivas.map(p =>
          this.polizaService.obtener(p.id).pipe(catchError(() => of(null)))
        );

        forkJoin(requests).subscribe(resultados => {
          this.polizas = resultados.filter(p => p !== null) as Poliza[];
          this.loading = false;
        });
      },
      error: () => { this.loading = false; this.router.navigate(['/clientes']); }
    });
  }

  severidadPoliza(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'warn' | 'danger'> = { ACTIVA: 'success', SUSPENDIDA: 'warn', CANCELADA: 'danger' };
    return map[estado];
  }

  severidadSiniestro(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = {
      ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger'
    };
    return map[estado];
  }

  etiquetaSiniestro(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }

  get totalSiniestros(): number {
    return this.polizas.reduce((acc, p) => acc + (p.siniestros?.length ?? 0), 0);
  }

  verSiniestro(id: number): void {
    this.router.navigate(['/siniestros', id]);
  }
}
