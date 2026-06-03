import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(private messageService: MessageService) {}

  success(detail: string, summary = 'Éxito'): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 3500 });
  }

  error(detail: string, summary = 'Error'): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  warn(detail: string, summary = 'Aviso'): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }

  info(detail: string, summary = 'Info'): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 3500 });
  }
}
