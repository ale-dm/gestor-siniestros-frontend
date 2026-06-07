import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { PolizaService } from '../../../core/services/poliza.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-form-poliza',
  templateUrl: './form-poliza.component.html'
})
export class FormPolizaComponent implements OnInit {

  form: FormGroup;
  loading = false;
  saving = false;
  polizaId: number | null = null;
  clientes: { label: string; value: number }[] = [];

  tipos = [
    { label: 'Hogar', value: 'HOGAR' },
    { label: 'Auto', value: 'AUTO' },
    { label: 'Vida', value: 'VIDA' },
    { label: 'Salud', value: 'SALUD' }
  ];

  constructor(
    private fb: FormBuilder,
    private polizaService: PolizaService,
    private clienteService: ClienteService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tipo:             ['', Validators.required],
      fechaInicio:      ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      coberturaMaxima:  [null, [Validators.required, Validators.min(0.01)]],
      primaMensual:     [null],
      descripcion:      ['', Validators.maxLength(500)],
      clienteId:        [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteService.listar('', 0, 100).subscribe(res => {
      this.clientes = res.content.map(c => ({
        label: `${c.apellidos}, ${c.nombre} (${c.dni})`,
        value: c.id
      }));
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.polizaId = +id;
      this.loading = true;
      this.polizaService.obtener(this.polizaId).subscribe({
        next: p => {
          // p-calendar trabaja con objetos Date; el backend entrega strings 'yyyy-MM-dd'.
          this.form.patchValue({
            ...p,
            clienteId: p.cliente?.id,
            fechaInicio: this.parseFecha(p.fechaInicio),
            fechaVencimiento: this.parseFecha(p.fechaVencimiento)
          });
          this.loading = false;
        },
        error: () => { this.loading = false; this.router.navigate(['/polizas']); }
      });
    }
  }

  get esEdicion(): boolean { return this.polizaId !== null; }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    // p-calendar emite Date; el backend (LocalDate) espera 'yyyy-MM-dd' sin desfase horario.
    const payload = {
      ...this.form.value,
      fechaInicio: this.formatFecha(this.form.value.fechaInicio),
      fechaVencimiento: this.formatFecha(this.form.value.fechaVencimiento)
    };

    const op = this.esEdicion
      ? this.polizaService.actualizar(this.polizaId!, payload)
      : this.polizaService.crear(payload);

    op.subscribe({
      next: () => {
        this.toast.success('Póliza guardada correctamente');
        setTimeout(() => this.router.navigate(['/polizas']), 800);
      },
      error: err => { this.toast.error(err.message); this.saving = false; }
    });
  }

  cancelar(): void { this.router.navigate(['/polizas']); }
  fieldInvalid(name: string): boolean { const c = this.form.get(name); return !!(c?.invalid && c?.touched); }

  /** 'yyyy-MM-dd' -> Date local (evita el desfase de zona horaria de `new Date(string)`). */
  private parseFecha(valor: string | null | undefined): Date | null {
    if (!valor) return null;
    const [a, m, d] = valor.split('-').map(Number);
    if (!a || !m || !d) return null;
    return new Date(a, m - 1, d);
  }

  /** Date (o string) -> 'yyyy-MM-dd' usando componentes locales, sin convertir a UTC. */
  private formatFecha(valor: Date | string | null | undefined): string | null {
    if (!valor) return null;
    if (typeof valor === 'string') return valor;
    const a = valor.getFullYear();
    const m = `${valor.getMonth() + 1}`.padStart(2, '0');
    const d = `${valor.getDate()}`.padStart(2, '0');
    return `${a}-${m}-${d}`;
  }
}
