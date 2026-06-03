import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html'
})
export class FormUsuarioComponent {

  form: FormGroup;
  saving = false;

  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Gestor', value: 'GESTOR' },
    { label: 'Perito', value: 'PERITO' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      nombre:    ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(150)]],
      email:     ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      rol:       ['', Validators.required]
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.usuarioService.crear(this.form.value).subscribe({
      next: u => {
        this.toast.success(`Usuario ${u.username} creado correctamente`);
        setTimeout(() => this.router.navigate(['/usuarios']), 800);
      },
      error: err => { this.toast.error(err.message); this.saving = false; }
    });
  }

  cancelar(): void { this.router.navigate(['/usuarios']); }
  fieldInvalid(name: string): boolean { const c = this.form.get(name); return !!(c?.invalid && c?.touched); }
}
