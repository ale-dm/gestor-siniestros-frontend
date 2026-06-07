import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/usuario.model';
import { ToastService } from '../services/toast.service';

/**
 * Protege una ruta según el rol del usuario. Los roles permitidos se declaran
 * en la propia ruta mediante `data: { roles: ['ADMIN', ...] }`.
 * Se apoya en authGuard para garantizar que el usuario ya está autenticado.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const roles = (route.data?.['roles'] as Rol[] | undefined) ?? [];

  if (roles.length === 0 || auth.hasRole(...roles)) return true;

  toast.error('No tienes permisos para acceder a esta sección');
  router.navigate(['/dashboard']);
  return false;
};
