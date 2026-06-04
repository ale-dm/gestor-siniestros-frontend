import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GlobalSearchComponent } from './shared/components/global-search/global-search.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild(GlobalSearchComponent) searchComp?: GlobalSearchComponent;

  isLoginPage = false;
  sidebarOpen = false;
  isMobile = false;

  allNavItems = [
    { label: 'Dashboard',  icon: 'pi pi-home',                   route: '/dashboard',   roles: null },
    { label: 'Siniestros', icon: 'pi pi-exclamation-triangle',   route: '/siniestros',  roles: null },
    { label: 'Clientes',   icon: 'pi pi-users',                  route: '/clientes',    roles: null },
    { label: 'Pólizas',   icon: 'pi pi-file',                    route: '/polizas',     roles: null },
    { label: 'Usuarios',   icon: 'pi pi-user-edit',              route: '/usuarios',    roles: ['ADMIN'] },
  ];

  get navItems() {
    const rol = this.auth.getRole();
    return this.allNavItems.filter(item =>
      item.roles === null || (rol !== null && item.roles.includes(rol))
    );
  }

  constructor(public auth: AuthService, private router: Router, public loading: LoadingService) {}

  ngOnInit(): void {
    this.checkMobile();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isLoginPage = e.urlAfterRedirects.startsWith('/login');
        // Cierra el sidebar al navegar en móvil
        if (this.isMobile) this.sidebarOpen = false;
      });
  }

  @HostListener('window:keydown.control.k', ['$event'])
  onCtrlK(e: KeyboardEvent): void {
    if (this.isLoginPage) return;
    e.preventDefault();
    this.searchComp?.abrirBusqueda();
  }

  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.auth.logout();
  }

  get currentUser() {
    return this.auth['currentUserSubject'].value;
  }
}
