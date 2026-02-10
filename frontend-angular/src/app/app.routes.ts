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
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'usuarios',
        loadComponent: () => import('./features/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/admin/roles-permisos/roles-permisos.component').then(m => m.RolesPermisosComponent)
      },
      {
        path: 'entidades',
        loadComponent: () => import('./features/admin/entidades/entidades.component').then(m => m.EntidadesComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./features/admin/configuracion/configuracion.component').then(m => m.ConfiguracionComponent)
      },
      {
        path: 'auditoria',
        loadComponent: () => import('./features/admin/auditoria/auditoria.component').then(m => m.AuditoriaComponent)
      }
    ]
  },
  {
    path: 'fuentes',
    loadComponent: () => import('./features/fuentes/fuentes.component').then(m => m.FuentesComponent)
  },
  {
    path: 'fuentes/:id',
    loadComponent: () => import('./features/fuentes/fuente-detalle/fuente-detalle-v2.component').then(m => m.FuenteDetalleV2Component)
  },
  {
    path: 'valores-base',
    loadComponent: () => import('./features/valores-base/valores-base.component').then(m => m.ValoresBaseComponent)
  },
  {
    path: 'parametrizacion-fuente',
    loadComponent: () => import('./features/parametrizacion/parametrizacion-fuente.component').then(m => m.ParametrizacionFuenteComponent)
  },
  {
    path: 'descuentos',
    loadComponent: () => import('./features/descuentos/descuentos.component').then(m => m.DescuentosComponent)
  },
  {
    path: 'exenciones',
    loadComponent: () => import('./features/exenciones/exenciones.component').then(m => m.ExencionesComponent)
  },
  {
    path: 'formulas',
    loadComponent: () => import('./features/formulas/formulas.component').then(m => m.FormulasComponent)
  },
  {
    path: 'liquidaciones',
    loadComponent: () => import('./features/liquidaciones/motor-liquidacion.component').then(m => m.MotorLiquidacionComponent)
  },
  {
    path: 'nueva-liquidacion',
    loadComponent: () => import('./features/liquidaciones/nueva-liquidacion-clean.component').then(m => m.NuevaLiquidacionComponent)
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
