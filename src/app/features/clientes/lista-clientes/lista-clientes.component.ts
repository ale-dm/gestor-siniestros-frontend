import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ClienteService } from '../../../core/services/cliente.service';
import { ToastService } from '../../../core/services/toast.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html'
})
export class ListaClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  totalRecords = 0;
  loading = false;
  search = '';
  page = 0;
  size = 10;

  private searchSubject = new Subject<string>();

  constructor(
    private clienteService: ClienteService,
    private confirmationService: ConfirmationService,
    private toast: ToastService,
    public router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => { this.page = 0; this.cargar(); });
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.clienteService.listar(this.search, this.page, this.size).subscribe({
      next: res => {
        this.clientes = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(value: string): void {
    this.search = value;
    this.searchSubject.next(value);
  }

  onPage(event: any): void {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.cargar();
  }

  editar(id: number): void {
    this.router.navigate(['/clientes', id, 'editar']);
  }

  confirmarDesactivar(cliente: Cliente): void {
    this.confirmationService.confirm({
      message: `¿Desactivar a ${cliente.nombre} ${cliente.apellidos}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.desactivar(cliente.id).subscribe({
          next: () => {
            this.toast.success('Cliente desactivado correctamente');
            this.cargar();
          }
        });
      }
    });
  }
}
