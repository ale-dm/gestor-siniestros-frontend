import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadChildren: () => import('./features/clientes/clientes.module').then(m => m.ClientesModule)
  },
  {
    path: 'polizas',
    canActivate: [authGuard],
    loadChildren: () => import('./features/polizas/polizas.module').then(m => m.PolizasModule)
  },
  {
    path: 'siniestros',
    canActivate: [authGuard],
    loadChildren: () => import('./features/siniestros/siniestros.module').then(m => m.SiniestrosModule)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadChildren: () => import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule)
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
