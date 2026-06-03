import { NgModule } from '@angular/core'; // updated
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule, ChartModule, TagModule, SkeletonModule
  ]
})
export class DashboardModule {}
