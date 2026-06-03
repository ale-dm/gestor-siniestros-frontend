import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state-wrapper">
      <div class="empty-icon">
        <i [class]="icon"></i>
      </div>
      <p class="empty-title">{{ title }}</p>
      <p class="empty-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
    </div>
  `,
  styles: [`
    .empty-state-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
    }
    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      i { font-size: 1.75rem; color: rgba(240,244,248,0.2); }
    }
    .empty-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: rgba(240,244,248,0.4);
      margin-bottom: 0.25rem;
    }
    .empty-subtitle {
      font-size: 0.8rem;
      color: rgba(240,244,248,0.25);
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'pi pi-inbox';
  @Input() title = 'Sin resultados';
  @Input() subtitle = '';
}
