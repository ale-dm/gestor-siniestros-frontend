import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';

@NgModule({
  declarations: [EmptyStateComponent, GlobalSearchComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [EmptyStateComponent, GlobalSearchComponent]
})
export class SharedModule {}
