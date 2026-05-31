import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'productos' },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth').then(m => m.Auth),
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categorias/categorias').then(m => m.Categorias),
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./productos/productos').then(m => m.Productos),
  },
  { path: '**', redirectTo: 'productos' },
];
