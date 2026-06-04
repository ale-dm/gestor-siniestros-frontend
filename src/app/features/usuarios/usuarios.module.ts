import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../../shared/shared.module';

import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

const routes: Routes = [
  { path: '', component: ListaUsuariosComponent },
  { path: 'nuevo', component: FormUsuarioComponent }
];

@NgModule({
  declarations: [ListaUsuariosComponent, FormUsuarioComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TableModule, ButtonModule, TagModule, CardModule,
    DropdownModule, InputTextModule, PasswordModule, TooltipModule
  ]
})
export class UsuariosModule {}
