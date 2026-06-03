import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../core/services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html'
})
export class FormClienteComponent implements OnInit {

  form: FormGroup;
  loading = false;
  saving = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre:    ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(150)]],
      dni:       ['', [Validators.required, Validators.maxLength(20)]],
      email:     ['', [Validators.email, Validators.maxLength(150)]],
      telefono:  ['', Validators.maxLength(20)],
      direccion: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = +id;
      this.loading = true;
      this.clienteService.obtener(this.clienteId).subscribe({
        next: c => { this.form.patchValue(c); this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/clientes']); }
      });
    }
  }

  get esEdicion(): boolean { return this.clienteId !== null; }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const op = this.esEdicion
      ? this.clienteService.actualizar(this.clienteId!, this.form.value)
      : this.clienteService.crear(this.form.value);

    op.subscribe({
      next: () => {
        this.toast.success('Cliente guardado correctamente');
        setTimeout(() => this.router.navigate(['/clientes']), 800);
      },
      error: err => {
        this.toast.error(err.message);
        this.saving = false;
      }
    });
  }

  cancelar(): void { this.router.navigate(['/clientes']); }

  fieldInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!(c?.invalid && c?.touched);
  }
}
