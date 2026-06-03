import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { SiniestroService } from '../../../core/services/siniestro.service';
import { PolizaService } from '../../../core/services/poliza.service';

@Component({
  selector: 'app-form-siniestro',
  templateUrl: './form-siniestro.component.html'
})
export class FormSiniestroComponent implements OnInit {

  form: FormGroup;
  saving = false;
  polizas: { label: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private siniestroService: SiniestroService,
    private polizaService: PolizaService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      descripcion:      ['', [Validators.required, Validators.maxLength(1000)]],
      importeReclamado: [null, Validators.min(0.01)],
      polizaId:         [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.polizaService.listar('ACTIVA', undefined, 0, 200).subscribe(res => {
      this.polizas = res.content.map(p => ({
        label: `${p.numeroPoliza} — ${p.cliente?.apellidos}, ${p.cliente?.nombre} (${p.tipo})`,
        value: p.id
      }));
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.siniestroService.crear(this.form.value).subscribe({
      next: s => {
        this.toast.success(`Siniestro ${s.numeroSiniestro} creado`);
        setTimeout(() => this.router.navigate(['/siniestros', s.id]), 800);
      },
      error: err => { this.toast.error(err.message); this.saving = false; }
    });
  }

  cancelar(): void { this.router.navigate(['/siniestros']); }
  fieldInvalid(name: string): boolean { const c = this.form.get(name); return !!(c?.invalid && c?.touched); }
}
