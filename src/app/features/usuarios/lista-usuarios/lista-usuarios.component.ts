import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html'
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.usuarioService.listar().subscribe({
      next: u => { this.usuarios = u; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  confirmarDesactivar(u: Usuario): void {
    this.confirmationService.confirm({
      message: `¿Desactivar a ${u.nombre} ${u.apellidos}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.desactivar(u.id).subscribe({
          next: () => { this.toast.success('Usuario desactivado'); this.cargar(); },
          error: err => this.toast.error(err.message)
        });
      }
    });
  }

  activar(u: Usuario): void {
    this.usuarioService.activar(u.id).subscribe({
      next: () => { this.toast.success('Usuario activado'); this.cargar(); },
      error: err => this.toast.error(err.message)
    });
  }

  severidadRol(rol: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' | undefined {
    const map: Record<string, 'danger' | 'warn' | 'info'> = { ADMIN: 'danger', GESTOR: 'warn', PERITO: 'info' };
    return map[rol];
  }
}
