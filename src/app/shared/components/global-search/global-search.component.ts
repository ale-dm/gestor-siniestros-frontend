import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../../../core/services/search.service';
import { SearchResult } from '../../../core/models/search.model';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {

  @ViewChild('inputRef') inputRef!: ElementRef;

  query = '';
  resultados: SearchResult[] = [];
  mostrarDropdown = false;
  cargando = false;
  totalResultados = 0;

  private query$ = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router) {
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.length < 2) {
          this.resultados = [];
          this.mostrarDropdown = false;
          return [];
        }
        this.cargando = true;
        return this.searchService.buscar(q);
      })
    ).subscribe({
      next: res => {
        if (!res) return;
        this.resultados = [
          ...res.clientes.map(c => ({
            type: 'cliente' as const,
            id: c.id,
            label: `${c.apellidos}, ${c.nombre}`,
            sublabel: c.dni,
            route: ['/clientes', String(c.id)]
          })),
          ...res.polizas.map(p => ({
            type: 'poliza' as const,
            id: p.id,
            label: p.numeroPoliza,
            sublabel: `${p.tipo} · ${p.estado}`,
            route: ['/polizas', String(p.id)]
          })),
          ...res.siniestros.map(s => ({
            type: 'siniestro' as const,
            id: s.id,
            label: s.numeroSiniestro,
            sublabel: this.etiqueta(s.estado),
            route: ['/siniestros', String(s.id)]
          }))
        ];
        this.totalResultados = this.resultados.length;
        this.mostrarDropdown = this.resultados.length > 0 || this.query.length >= 2;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  onInput(): void {
    this.query$.next(this.query);
  }

  navegar(resultado: SearchResult): void {
    this.router.navigate(resultado.route);
    this.cerrar();
  }

  cerrar(): void {
    this.mostrarDropdown = false;
    this.query = '';
    this.resultados = [];
  }

  abrirBusqueda(): void {
    this.mostrarDropdown = true;
    setTimeout(() => this.inputRef?.nativeElement?.focus(), 50);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.cerrar(); }

  iconoPorTipo(tipo: string): string {
    return { cliente: 'pi-user', poliza: 'pi-file', siniestro: 'pi-exclamation-triangle' }[tipo] ?? 'pi-search';
  }

  etiquetaTipo(tipo: string): string {
    return { cliente: 'Cliente', poliza: 'Póliza', siniestro: 'Siniestro' }[tipo] ?? tipo;
  }

  private etiqueta(estado: string): string {
    return { ABIERTO: 'Abierto', EN_PERITACION: 'En peritación', RESUELTO: 'Resuelto', DENEGADO: 'Denegado' }[estado] ?? estado;
  }

  get clientes() { return this.resultados.filter(r => r.type === 'cliente'); }
  get polizas()  { return this.resultados.filter(r => r.type === 'poliza'); }
  get siniestros(){ return this.resultados.filter(r => r.type === 'siniestro'); }
}
