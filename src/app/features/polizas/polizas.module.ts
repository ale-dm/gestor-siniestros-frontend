import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ListaPolizasComponent } from './lista-polizas/lista-polizas.component';
import { FormPolizaComponent } from './form-poliza/form-poliza.component';

const routes: Routes = [
  { path: '', component: ListaPolizasComponent },
  { path: 'nueva', component: FormPolizaComponent },
  { path: ':id/editar', component: FormPolizaComponent }
];

@NgModule({
  declarations: [ListaPolizasComponent, FormPolizaComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    DropdownModule, CalendarModule, InputNumberModule,
    CardModule, ToastModule, ConfirmDialogModule
  ],
  providers: []
})
export class PolizasModule {}
