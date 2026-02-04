import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'parametrizacion',
    loadComponent: () => import('./features/parametrizacion/parametrizacion.component').then(m => m.ParametrizacionComponent)
  },
  {
    path: 'formulas',
    loadComponent: () => import('./features/formulas/formulas.component').then(m => m.FormulasComponent)
  },
  {
    path: 'liquidaciones',
    loadComponent: () => import('./features/liquidaciones/liquidaciones.component').then(m => m.LiquidacionesComponent)
  },
  {
    path: 'facturas',
    loadComponent: () => import('./features/facturas/facturas.component').then(m => m.FacturasComponent)
  },
  {
    path: 'pagos',
    loadComponent: () => import('./features/pagos/pagos.component').then(m => m.PagosComponent)
  },
  {
    path: 'cartera',
    loadComponent: () => import('./features/cartera/cartera.component').then(m => m.CarteraComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
