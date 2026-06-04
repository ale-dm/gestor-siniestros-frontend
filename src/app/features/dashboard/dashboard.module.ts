import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterModule,
    ChartModule,
    SkeletonModule
  ]
})
export class DashboardModule {}
