import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { SiniestroService } from '../../../core/services/siniestro.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Siniestro, LogSiniestro, EstadoSiniestro } from '../../../core/models/siniestro.model';
import { UsuarioResumen } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-detalle-siniestro',
  templateUrl: './detalle-siniestro.component.html'
})
export class DetalleSiniestroComponent implements OnInit {

  siniestro: Siniestro | null = null;
  logs: LogSiniestro[] = [];
  peritos: { label: string; value: number }[] = [];
  loading = false;

  mostrarDialogEstado = false;
  mostrarDialogPerito = false;
  formEstado: FormGroup;
  formPerito: FormGroup;
  guardando = false;

  estados: { label: string; value: EstadoSiniestro }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private siniestroService: SiniestroService,
    private usuarioService: UsuarioService,
    public auth: AuthService,
    private toast: ToastService
  ) {
    this.formEstado = this.fb.group({
      estado:             ['', Validators.required],
      importeIndemnizado: [null],
      observaciones:      ['']
    });
    this.formPerito = this.fb.group({
      peritoId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.cargar(id);
    this.usuarioService.peritos().subscribe(peritos => {
      this.peritos = peritos.map(p => ({ label: `${p.nombre} ${p.apellidos}`, value: p.id }));
    });
  }

  cargar(id: number): void {
    this.loading = true;
    this.siniestroService.obtener(id).subscribe({
      next: s => {
        this.siniestro = s;
        this.loading = false;
        this.actualizarEstadosDisponibles(s.estado);
        this.siniestroService.obtenerLog(id).subscribe(logs => this.logs = logs);
      },
      error: () => { this.loading = false; this.router.navigate(['/siniestros']); }
    });
  }

  actualizarEstadosDisponibles(actual: EstadoSiniestro): void {
    const mapa: Record<EstadoSiniestro, { label: string; value: EstadoSiniestro }[]> = {
      ABIERTO:       [{ label: 'En peritación', value: 'EN_PERITACION' }],
      EN_PERITACION: [{ label: 'Resuelto', value: 'RESUELTO' }, { label: 'Denegado', value: 'DENEGADO' }],
      RESUELTO:      [],
      DENEGADO:      []
    };
    this.estados = mapa[actual] ?? [];
  }

  abrirDialogEstado(): void { this.formEstado.reset(); this.mostrarDialogEstado = true; }
  abrirDialogPerito(): void { this.formPerito.reset(); this.mostrarDialogPerito = true; }

  cambiarEstado(): void {
    if (this.formEstado.invalid) return;
    this.guardando = true;
    this.siniestroService.cambiarEstado(this.siniestro!.id, this.formEstado.value).subscribe({
      next: s => {
        this.siniestro = s;
        this.mostrarDialogEstado = false;
        this.guardando = false;
        this.actualizarEstadosDisponibles(s.estado);
        this.siniestroService.obtenerLog(s.id).subscribe(logs => this.logs = logs);
        this.toast.success(`Estado actualizado a ${s.estado}`);
      },
      error: err => { this.toast.error(err.message); this.guardando = false; }
    });
  }

  asignarPerito(): void {
    if (this.formPerito.invalid) return;
    this.guardando = true;
    this.siniestroService.asignarPerito(this.siniestro!.id, this.formPerito.value).subscribe({
      next: s => {
        this.siniestro = s;
        this.mostrarDialogPerito = false;
        this.guardando = false;
        this.toast.success(`Perito asignado: ${s.perito?.nombre} ${s.perito?.apellidos}`);
      },
      error: err => { this.toast.error(err.message); this.guardando = false; }
    });
  }

  get puedeAsignarPerito(): boolean {
    return this.auth.hasRole('ADMIN', 'GESTOR') && this.siniestro?.estado === 'ABIERTO';
  }

  get puedeCambiarEstado(): boolean {
    return this.estados.length > 0;
  }

  severidad(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'info' | 'warn' | 'success' | 'danger'> = { ABIERTO: 'info', EN_PERITACION: 'warn', RESUELTO: 'success', DENEGADO: 'danger' };
    return map[estado];
  }

  etiqueta(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }
}
