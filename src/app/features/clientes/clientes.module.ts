import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';

const routes: Routes = [
  { path: '', component: ListaClientesComponent },
  { path: 'nuevo', component: FormClienteComponent },
  { path: ':id', component: DetalleClienteComponent },
  { path: ':id/editar', component: FormClienteComponent }
];

@NgModule({
  declarations: [ListaClientesComponent, FormClienteComponent, DetalleClienteComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    ConfirmDialogModule, ToastModule, CardModule,
    IconFieldModule, InputIconModule, DividerModule,
    SkeletonModule, TooltipModule
  ],
  providers: []
})
export class ClientesModule {}
