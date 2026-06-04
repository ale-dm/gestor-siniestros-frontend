import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ListaSiniestrosComponent } from './lista-siniestros/lista-siniestros.component';
import { DetalleSiniestroComponent } from './detalle-siniestro/detalle-siniestro.component';
import { FormSiniestroComponent } from './form-siniestro/form-siniestro.component';

const routes: Routes = [
  { path: '', component: ListaSiniestrosComponent },
  { path: 'nuevo', component: FormSiniestroComponent },
  { path: ':id', component: DetalleSiniestroComponent }
];

@NgModule({
  declarations: [ListaSiniestrosComponent, DetalleSiniestroComponent, FormSiniestroComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TableModule, ButtonModule, TagModule, DropdownModule,
    InputNumberModule, InputTextModule, TextareaModule,
    CardModule, ToastModule, DialogModule, TimelineModule, TooltipModule,
    DividerModule, ConfirmDialogModule, ChipModule
  ],
  providers: []
})
export class SiniestrosModule {}
